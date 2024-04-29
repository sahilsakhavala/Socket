import express from "express";
const app = express();
import { sequelize } from "./config/db.js";
import router from "./routes/index.js";
import multer from "multer";
import path from "path";
import { db } from "./config/db.js";
import http from "http";
import { Server } from 'socket.io';
import { createServer } from 'http';
import { socketAuth } from "./middleware/auth.js";

const server = createServer(app);

const Chat = db.chats
const Socket = db.sockets

const io = new Server(server);

app.use(multer().any());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.use(socketAuth);

io.on("connection", async (socket) => {
    console.log("a user connected");

    try {
        await Socket.create({
            user_id: socket.user.id,
            socket_id: socket.id
        });
    } catch (error) {
        console.error("Error creating socket data:", error);
    }

    socket.on("disconnect", async () => {
        console.log("user disconnected");

        try {
            await Socket.destroy({
                where: {
                    socket_id: socket.id
                }
            });
        } catch (error) {
            console.error("Error deleting socket data:", error);
        }
    });

    socket.on("chat message", async (messageData) => {
        const data = JSON.parse(messageData);
        try {
            // Save the message to the database
            await Chat.create({
                sender_id: socket.user.id,
                receiver_id: data.receiverId,
                message: data.message
            });

            // Emit the message back to the sender
            io.to(socket.id).emit("chat", {
                sender_id: socket.user.id,
                message: data.message
            });

            // Find the recipient's socket and emit the message to them
            const recipientSocket = await Socket.findOne({ where: { user_id: data.receiverId } });
            if (recipientSocket) {
                io.to(recipientSocket.socket_id).emit("chat", {
                    sender_id: socket.user.id,
                    message: data.message
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
});

app.use(express.static(path.join(process.cwd(), 'public')));

app.use("/api/v1", router);

server.listen(3000, () => {
    console.log("Server is running on port 3000");
})