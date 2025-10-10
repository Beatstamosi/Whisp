import { Router } from "express";
import validateJWTToken from "../middlewares/validateJWTToken.js";
import {
  getAllChats,
  openChatWithUser,
  getSingleChat,
} from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.use(validateJWTToken);

chatRouter.get("/", getAllChats);
chatRouter.get("/open-chat-user/:recipientId", openChatWithUser);
chatRouter.get("/:chatId", getSingleChat);

export default chatRouter;
