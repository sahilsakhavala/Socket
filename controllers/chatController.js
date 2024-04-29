import { db } from "../config/db.js";
import Joi from "joi";
import { Sequelize } from "sequelize";

const Chat = db.chats

const getMessages = async (req, res) => {
    const getSchema = Joi.object({
        receiver_id: Joi.number().required()
    })
    const { error } = getSchema.validate(req.query || {})
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    try {
        const { user: { id: user_id }, query: { receiver_id } } = req
        const messages = await Chat.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { sender_id: user_id, receiver_id },
                    { sender_id: receiver_id, receiver_id: user_id }
                ]
            },
            order: [['created_at', 'DESC']],
        })

        return res.status(200).json({ success: true, message: "Chat get successfully", data: messages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getLatestChatMessages = async (req, res) => {
    try {
        const { user: { id: user_id } } = req

        const latestMessages = await Chat.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { sender_id: user_id },
                    { receiver_id: user_id }
                ]
            },
            order: [['created_at', 'DESC']],
        });

        res.status(200).json({ success: true, message: "Latest chat messages retrieved successfully", data: latestMessages });
    } catch (error) {
        console.error("Error fetching latest chat messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export {
    getMessages,
    getLatestChatMessages
}