import { Sequelize, DataTypes } from "sequelize";
import User from "../models/user.model.js";
import UserSession from "../models/userSession.model.js";
import Post from "../models/post.model.js";
import Image from "../models/image.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";
import Chat from "../models/chat.model.js";
import Socket from "../models/socket.model.js";

const sequelize = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    logging: false,
    port: 3306,
    username: "root",
    password: "",
    database: "instagram",
})

sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.");
})

const db = {};
db.sequelize = sequelize;
db.users = User(sequelize, DataTypes);
db.userSessions = UserSession(sequelize, DataTypes);
db.posts = Post(sequelize, DataTypes);
db.images = Image(sequelize, DataTypes);
db.likes = Like(sequelize, DataTypes);
db.comments = Comment(sequelize, DataTypes);
db.chats = Chat(sequelize, DataTypes);
db.sockets = Socket(sequelize, DataTypes);

db.users.hasMany(db.userSessions, { foreignKey: 'user_id' })
db.userSessions.belongsTo(db.users, { foreignKey: 'user_id' })

db.users.hasMany(db.posts, { foreignKey: 'user_id' })
db.posts.belongsTo(db.users, { foreignKey: 'user_id' })

db.posts.hasMany(db.images, { foreignKey: 'post_id' })
db.images.belongsTo(db.posts, { foreignKey: 'post_id' })

db.posts.hasMany(db.likes, { foreignKey: 'post_id' })
db.likes.belongsTo(db.posts, { foreignKey: 'post_id' })

db.users.hasMany(db.likes, { foreignKey: 'user_id' })
db.likes.belongsTo(db.users, { foreignKey: 'user_id' })

db.users.hasMany(db.comments, { foreignKey: 'user_id' })
db.comments.belongsTo(db.users, { foreignKey: 'user_id' })

db.posts.hasMany(db.comments, { foreignKey: 'post_id' })
db.comments.belongsTo(db.posts, { foreignKey: 'post_id' })

db.users.hasMany(db.chats, { foreignKey: 'user_id' })
db.chats.belongsTo(db.users, { foreignKey: 'user_id' })

db.users.hasMany(db.chats, { foreignKey: 'receiver_id' })
db.chats.belongsTo(db.users, { foreignKey: 'receiver_id' })

db.chats.hasMany(db.chats, { foreignKey: 'sender_id' })
db.chats.belongsTo(db.chats, { foreignKey: 'sender_id' })

db.users.hasMany(db.sockets, { foreignKey: 'user_id' })
db.sockets.belongsTo(db.users, { foreignKey: 'user_id' })

sequelize.sync()

export {
    db,
    sequelize
}