import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "https://audio-player-9gwn.onrender.com",
            credentials: true,
        },
    });

    const userSockets = new Map();
    const userActivities = new Map();

    io.on("connection", (socket) => {
        socket.on("user_connected", (userId) => {
            if (!userId) return;
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle");
            io.emit("user_connected", userId);
            io.emit("users_online", Array.from(userSockets.keys()));
            io.emit("activities", Array.from(userActivities.entries()));
        });
        socket.on("update_activity", ({ userId, activity }) => {
            if (!userId) return;
            userActivities.set(userId, activity);
            io.emit("activity_updated", { userId, activity });
        });
        socket.on("request_initial_data", () => {
            socket.emit("users_online", Array.from(userSockets.keys()));
            socket.emit("activities", Array.from(userActivities.entries()));
        });
        socket.on("send_message", async (data) => {
            console.log("SOCKET SERVER: Received 'send_message' event with data:", data);
            try {
                const { receiverId, senderId, content } = data;
                console.log("SOCKET SERVER: Saving message to MongoDB...");
                const message = await Message.create({
                    senderId,
                    receiverId,
                    content,
                });
                console.log("SOCKET SERVER: Message saved successfully in MongoDB:", message);
                const receiverSocketId = userSockets.get(receiverId);
                console.log(`SOCKET SERVER: Receiver socket ID for ${receiverId} is:`, receiverSocketId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                    console.log("SOCKET SERVER: Emitted 'receive_message' to receiver socket");
                }
                socket.emit("receive_message", message);
                socket.emit("message_sent", message);
                console.log("SOCKET SERVER: Emitted 'receive_message' and 'message_sent' to sender socket");
            } catch (error) {
                console.error("SOCKET SERVER: Error saving message to MongoDB:", error);
                socket.emit("message_error", error.message);
            }
        });
        socket.on("disconnect", () => {
            let disconnectedUserId;
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    userSockets.delete(userId);
                    userActivities.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                console.log("User disconnected:", disconnectedUserId);
                io.emit("user_disconnected", disconnectedUserId);
                io.emit("users_online", Array.from(userSockets.keys()));
            }
        });
    });
};