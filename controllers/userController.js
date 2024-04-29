import { db } from "../config/db.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import { uploadFile } from "../helper/upload.js";
import { fileValidation } from "../helper/fileValidation.js";
import { createToken } from "../helper/verifyToken.js";
import { deleteImage } from "../helper/deleteImage.js";

const User = db.users
const UserSession = db.userSessions

export const signUp = async (req, res) => {
    const registerSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
    const { error } = registerSchema.validate(req.body || {})
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        const { body: { name, email, password } } = req

        const verifyEmail = await User.findOne({ where: { email } })
        if (verifyEmail) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const files = req.files
        const verifyImage = await fileValidation(files)
        if (!verifyImage.success) {
            return res.status(400).json({ message: verifyImage.message })
        }
        const image = uploadFile(files)


        await User.create({
            name,
            email,
            password: hashedPassword,
            profile_image: image
        })

        res.status(201).json({ success: true, message: "User created successfully" })
    } catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const signIn = async (req, res) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    const { error } = loginSchema.validate(req.body || {})
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        const { body: { email, password } } = req

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(400).json({
                message: "email or password is incorrect"
            })
        }

        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            return res.status(400).json({
                message: "email or password is incorrect"
            })

        }

        const randomString = Math.random().toString(36).substring(2, 17);
        const payload = { id: user.id, randomString: randomString }
        const token = await createToken(payload);

        await UserSession.create({
            user_id: user.id,
            token
        })

        return res.status(200).json({ success: true, message: "User logged in successfully", token })
    } catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getProfile = async (req, res) => {
    try {
        const { user: { id } } = req

        const user = await User.findOne({
            where: { id },
            attributes: {
                exclude: ['password']
            }
        })

        return res.status(200).json({ success: true, message: "User profile get successfully", user: user })
    } catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfle = async (req, res) => {
    const updateSchema = Joi.object({
        name: Joi.string(),
        is_private: Joi.boolean()
    })
    const { error } = updateSchema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        const { user: { id }, body: { name, is_private } } = req

        const updateObj = {
            name,
            is_private
        }

        if (req.files && req.files.length > 0) {
            const verifyFile = await fileValidation(req.files);
            if (!verifyFile.success) {
                return res.status(422).json({
                    success: false,
                    message: verifyFile.message
                });
            }
            const image = uploadFile(req.files);
            const verifyUser = await User.findOne({ where: { id } })
            const imageName = verifyUser.dataValues.profile_image;
            if (imageName) {
                deleteImage(imageName);
            }
            updateObj.profile_image = image;
        }

        await User.update(updateObj, { where: { id } })

        return res.status(200).json({ success: true, message: "User profile updated successfully" })
    }
    catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({ message: "Internal server error" })
    }
}