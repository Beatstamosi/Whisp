import { Router } from "express";
import validateJWTToken from "../middlewares/validateJWTToken.js";
import { deleteUser, updateUser } from "../controllers/userController.js";
import multer from "multer";

const userRouter = Router();

const upload = multer();

userRouter.use(validateJWTToken);

userRouter.put("/update", upload.single("profile_picture"), updateUser);
userRouter.delete("/delete", deleteUser);

export default userRouter;
