import express from "express";
import {
  getNotifications,
  markAsRead,
  getUnreadCount,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/list", getNotifications);
notificationRouter.post("/read", markAsRead);
notificationRouter.get("/unread-count", getUnreadCount);
export default notificationRouter;
