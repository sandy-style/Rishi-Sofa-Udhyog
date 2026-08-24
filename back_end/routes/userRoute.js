import express from "express";
import {
  registerUser,
  logUser,
  adminLogin,
  verifyUser,
  resendVerificationCode,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", logUser);
userRouter.post("/verify-email", verifyUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/resend-code", resendVerificationCode);

export default userRouter;
