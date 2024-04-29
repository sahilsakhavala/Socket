import { db } from "../config/db.js";
import Joi from "joi";

const User = db.users
const Post = db.posts
const Like = db.likes

export const likePost = async (req, res) => {
    const likeSchema = Joi.object({
        post_id: Joi.string().required(),
    })
    const { error } = likeSchema.validate(req.query || {})
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        const { user: { id }, query: { post_id } } = req

        const post = await Post.findOne({
            where: { id: post_id },
            include: [{
                model: User,
                where: { is_private: false }
            }]
        })
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        const checkLike = await Like.findOne({ where: { user_id: id, post_id } })
        if (checkLike) {
            await Like.destroy({ where: { user_id: id, post_id } })
            return res.status(200).json({ success: true, message: "Post unliked successfully" })
        }

        await Like.create({ user_id: id, post_id })

        return res.status(200).json({ success: true, message: "Post liked successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getLikes = async (req, res) => {
    try {
        const { query: { post_id } } = req
        const likes = await Like.findAll({
            where: { post_id },
            attributes: {
                exclude: ['user_id']
            },
            include: [{
                model: User,
                attributes: [
                    'name',
                    'email',
                    'profile_image'

                ]
            }]
        });

        return res.status(200).json({
            success: true,
            message: "Likes get successfully",
            data: {
                totallikes: likes.length,
                likes
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}