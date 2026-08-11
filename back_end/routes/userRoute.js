import express from "express";
import {
  registerUser,
  logUser,
  adminLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", logUser);
userRouter.post("/admin", adminLogin);

export default userRouter;
