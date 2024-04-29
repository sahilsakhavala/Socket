import { DataTypes } from "sequelize";
import { config } from "../config/config.js";

const User = (sequelize) => {
    const UserModel = sequelize.define('users', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true,
            get() {
                const profile_image = this.getDataValue('profile_image');
                if (profile_image) {
                    return `${config.url}/image/${profile_image}`;
                }
                return null;
            }
        },
        is_private: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
        {
            toJSON: { getters: true },
            toObject: { getters: true },
            createdAt: 'created_at',
            updatedAt: 'updated_at'

        });

    return UserModel;
};

export default User;
