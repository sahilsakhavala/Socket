import { db } from "../config/db.js";
import Joi from "joi";

const Post = db.posts
const Comment = db.comments
const User = db.users

export const addComment = async (req, res) => {
    const createSchema = Joi.object({
        comment: Joi.string().required()
    })
    const { error } = createSchema.validate(req.body || {})
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        const { user: { id }, body: { comment }, query: { post_id } } = req

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

        await Comment.create({ user_id: id, post_id, comment })

        return res.status(201).json({ success: true, message: "Comment created successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getComments = async (req, res) => {
    try {
        const { query: { post_id } } = req

        const comments = await Comment.findAll({
            attributes: {
                exclude: ['user_id']
            },
            where: { post_id },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ['password']
                    }
                }
            ]
        });
        if (!comments) {
            return res.status(404).json({ message: "Comments not found" })
        }

        const commentsCount = await Comment.count({ where: { post_id } });

        return res.status(200).json({
            success: true,
            message: "Comments get successfully",
            data: {
                commentsCount,
                comments
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteComment = async (req, res) => {
    const deleteSchema = Joi.object({
        comment_id: Joi.string().required()
    })
    const { error } = deleteSchema.validate(req.query || {})
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        const { user: { id }, query: { comment_id } } = req

        const comment = await Comment.findOne({ where: { id: comment_id, user_id: id } })
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }

        const post = await Post.findOne({ where: { id: comment.post_id } });
        if (!post || (post.user_id !== id && comment.user_id !== id)) {
            return res.status(403).json({ message: "Unauthorized to delete the comment" });
        }

        await Comment.destroy({ where: { id: comment_id } })

        return res.status(200).json({ success: true, message: "Comment deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}