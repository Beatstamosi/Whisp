import { Router } from "express";
import {
  getUser,
  loginHandler,
  signUpHandler,
  userAlreadySignedUp,
  logOutHandler,
} from "../controllers/authControllers.js";
import { validateSignUp } from "../middlewares/validateSignUp.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import validateJWTToken from "../middlewares/validateJWTToken.js";

const authRouter = Router();

// SIGN UP
authRouter.post(
  "/sign-up",
  validateSignUp,
  handleValidationErrors,
  signUpHandler
);

// LOGIN
authRouter.post("/login", validateLogin, handleValidationErrors, loginHandler);

// GET USER
authRouter.get("/me", validateJWTToken, getUser);

// CHECK IF USER / EMAIL ALREADY SIGNED UP
authRouter.post("/check-email", userAlreadySignedUp);

// Set last_seen_at on logout
authRouter.put("/:userId/logout", logOutHandler);

export default authRouter;
