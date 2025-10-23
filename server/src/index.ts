import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import passport from "passport";
import "./config/passport.js";
import http from "http";
import fs from "fs";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import chatRouter from "./routes/chats.js";
import messageRouter from "./routes/messages.js";
import { initializeSocket } from "./socket.js";

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create HTTP server for WebSocket
const server = http.createServer(app);
initializeSocket(server);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

// Enable CORS during development
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );
}

if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: ["https://whisp-front-end-production.up.railway.app"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
}
app.options("*", cors());

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/chats", chatRouter);
app.use("/messages", messageRouter);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.resolve(__dirname, "../../client/dist");

  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));

    app.get("*", (_, res) => {
      res.sendFile(path.join(clientDistPath, "index.html"));
    });
  } else {
    console.warn("⚠️ client/dist not found, skipping static serve");
  }
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
