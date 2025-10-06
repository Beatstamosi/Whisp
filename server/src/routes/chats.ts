import { Router } from "express";
import validateJWTToken from "../middlewares/validateJWTToken.js";
import { getAllChats } from "../controllers/chatController.js";

const chatRouter = Router();

chatRouter.use(validateJWTToken);

chatRouter.get("/", getAllChats);

export default chatRouter;
