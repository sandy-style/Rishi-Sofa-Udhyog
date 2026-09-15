import express from "express";

import {
  saveSubscription,
  saveAdminSubscription,
} from "../Controllers/pushSubscriptionController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
const pushSubscriptionRouter = express.Router();
pushSubscriptionRouter.post("/admin-save", adminAuth, saveAdminSubscription);
pushSubscriptionRouter.post("/subscribe", authUser, saveSubscription);

export default pushSubscriptionRouter;
