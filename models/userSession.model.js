import { DataTypes } from "sequelize";

const UserSession = (sequelize) => {
    const UserSessionModel = sequelize.define('userSessions', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return UserSessionModel;
}

export default UserSession