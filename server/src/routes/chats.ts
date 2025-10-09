import { Router } from "express";
import validateJWTToken from "../middlewares/validateJWTToken.js";
import {
  getAllChats,
  openChatWithUser,
} from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.use(validateJWTToken);

chatRouter.get("/", getAllChats);
chatRouter.get("/open-chat-user/:recipientId", openChatWithUser);

export default chatRouter;
