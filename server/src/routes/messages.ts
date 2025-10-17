import { Router } from "express";
import validateJWTToken from "../middlewares/validateJWTToken.js";
import { markMessageAsRead } from "../controllers/messageController.js";

const messageRouter = Router();

messageRouter.use(validateJWTToken);

messageRouter.put("/read/:messageId/:userId", markMessageAsRead);

export default messageRouter;
