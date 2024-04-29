import { DataTypes } from "sequelize";

const Image = (sequelize) => {
    const ImageModel = sequelize.define('images', {
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return ImageModel;
}

export default Image