import { DataTypes } from "sequelize";

const Post = (sequelize) => {
    const PostModel = sequelize.define('posts', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        caption: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING
        }
    },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return PostModel;
}

export default Post