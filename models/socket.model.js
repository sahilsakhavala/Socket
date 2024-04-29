import { DataTypes } from "sequelize";

const Socket = (sequelize) => {
    const SocketModel = sequelize.define('sockets', {
        user_id: {
            type: DataTypes.INTEGER
        },
        socket_id: {
            type: DataTypes.STRING
        }
    },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        });
    return SocketModel;
}

export default Socket