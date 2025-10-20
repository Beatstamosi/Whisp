import { Server, Socket } from "socket.io";
import http from "http";
import type { Chats } from "@prisma/client";

interface ClientToServerEvents {
  join: (chatId: string) => void;
  leave: (chatId: string) => void;
}

interface ServerToClientEvents {
  "chat:message": (chat: Chats) => void;
  "chatList:update": (arg: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId?: string;
}

// ---- Socket.IO instance ----
let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

/**
 * Initializes the Socket.IO server and attaches it to HTTP server.
 */
export function initializeSocket(server: http.Server) {
  io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    // Update chat list page
    socket.on("join-user-room", (userId: string) => {
      socket.join(userId);
    });

    socket.on("leave-user-room", (userId: string) => {
      socket.leave(userId);
    });

    // Update active Chat Page
    socket.on("join", (chatId: string) => {
      socket.join(chatId);
    });

    socket.on("leave", (chatId: string) => {
      socket.leave(chatId);
    });
  });
}

/**
 * Accessor for the initialized Socket.IO instance.
 */
export function getIO(): Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {
  if (!io) {
    throw new Error(
      "Socket.io not initialized. Call initializeSocket(server) first."
    );
  }
  return io;
}
