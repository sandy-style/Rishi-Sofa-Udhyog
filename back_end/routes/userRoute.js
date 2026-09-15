import express from "express";
import authUser from "../middleware/auth.js";
import {
  registerUser,
  logUser,
  adminLogin,
  verifyUser,
  resendVerificationCode,
  googleLogin,
  getUserData,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", logUser);

userRouter.post("/verify-email", verifyUser);

userRouter.post("/admin", adminLogin);

userRouter.post("/resend-code", resendVerificationCode);

userRouter.post("/google", googleLogin);

userRouter.get("/getuserdata", authUser, getUserData);
export default userRouter;
