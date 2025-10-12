import { Router } from "express";
import validateJWTToken from "../middlewares/validateJWTToken.js";
import {
  getAllChats,
  openChatWithUser,
  getSingleChat,
  addMessage,
} from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.use(validateJWTToken);

chatRouter.get("/", getAllChats);
chatRouter.get("/open-chat-user/:recipientId", openChatWithUser);
chatRouter.get("/:chatId", getSingleChat);
chatRouter.post("/:chatId/message", addMessage);

export default chatRouter;
