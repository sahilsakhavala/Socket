import { DataTypes } from "sequelize";

const Chat = (sequelize) => {
    const ChatModel = sequelize.define('chats', {
        sender_id: {
            type: DataTypes.INTEGER
        },
        receiver_id: {
            type: DataTypes.INTEGER
        },
        message: {
            type: DataTypes.STRING
        }
    },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return ChatModel;
}

export default Chat