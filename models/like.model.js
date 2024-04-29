import { DataTypes } from "sequelize";

const Like = (sequelize) => {
    const LikeModel = sequelize.define('likes', {
        post_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
    },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return LikeModel;
}

export default Like