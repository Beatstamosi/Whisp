import { Server } from "socket.io";
// ---- Socket.IO instance ----
let io;
/**
 * Initializes the Socket.IO server and attaches it to HTTP server.
 */
export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        // Update chat list page
        socket.on("join-user-room", (userId) => {
            socket.join(userId);
        });
        socket.on("leave-user-room", (userId) => {
            socket.leave(userId);
        });
        // Update active Chat Page
        socket.on("join", (chatId) => {
            socket.join(chatId);
        });
        socket.on("leave", (chatId) => {
            socket.leave(chatId);
        });
    });
}
/**
 * Accessor for the initialized Socket.IO instance.
 */
export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized. Call initializeSocket(server) first.");
    }
    return io;
}
