import { DataTypes } from "sequelize";

const Comment = (sequelize) => {
    const CommentModel = sequelize.define('comments', {
        post_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        comment: {
            type: DataTypes.STRING
        },
    },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return CommentModel;
}

export default Comment