import express from "express";

import {
  getNotifications,
  markAsRead,
  getUnreadCount,
  getAdminNotifications,
  getAdminUnreadCount,
  markAdminAsRead,
} from "../controllers/notificationController.js";

import authUser from "../middleware/auth.js";
const notificationRouter = express.Router();

// ============================================================
// CUSTOMER NOTIFICATIONS
// ============================================================

notificationRouter.get("/list", authUser, getNotifications);

notificationRouter.post("/read", authUser, markAsRead);

notificationRouter.get("/unread-count", authUser, getUnreadCount);

// ============================================================
// ADMIN NOTIFICATIONS
// ============================================================

notificationRouter.get("/admin-list", getAdminNotifications);

notificationRouter.get("/admin-unread-count", getAdminUnreadCount);

notificationRouter.post("/admin-read", markAdminAsRead);

export default notificationRouter;
