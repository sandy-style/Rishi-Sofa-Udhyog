import express from "express";
import { saveSubscription } from "../controllers/pushSubscriptionController.js";

const pushSubscriptionRouter = express.Router();

pushSubscriptionRouter.post("/subscribe", saveSubscription);

export default pushSubscriptionRouter;
