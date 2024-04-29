import { db } from "../config/db.js";
import { upload } from "../helper/upload.js";
import Joi from "joi";

const User = db.users
const Post = db.posts
const Image = db.images

export const createPost = async (req, res) => {
    const createSchema = Joi.object({
        caption: Joi.string(),
        location: Joi.string()
    })
    const { error } = createSchema.validate(req.body || {})
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        const { user: { id }, body: { caption, location } } = req

        const files = req.files
        if (!files || files.length === 0) {
            return res.status(400).json({
                message: "Image is required"
            })
        }

        const images = await upload(files);
        const post = await Post.create({ user_id: id, caption, location });

        const Images = images.images.map(image => ({ post_id: post.id, image }));
        await Image.bulkCreate(Images);

        return res.status(201).json({ success: true, message: "Post created successfully" })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getPost = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    where: { is_private: false },
                    attributes: {
                        exclude: ['password']
                    }
                },
                {
                    model: Image,
                    attributes: {
                        exclude: ['post_id']
                    }
                }
            ],
            attributes: {
                exclude: ['user_id']
            }
        });

        return res.status(200).json({ success: true, message: "Post get successfully", data: posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deletePost = async (req, res) => {
    const deleteSchema = Joi.object({
        post_id: Joi.string().required()
    })
    const { error } = deleteSchema.validate(req.query || {})
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        const { user: { id }, query: { post_id } } = req

        const post = await Post.findOne({ where: { id: post_id, user_id: id } })
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        await Post.destroy({ where: { id: post_id } })

        await Image.destroy({ where: { post_id } })

        return res.status(200).json({ success: true, message: "Post deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}