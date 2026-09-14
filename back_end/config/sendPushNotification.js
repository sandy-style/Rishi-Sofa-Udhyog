import webpush from "./webPush.js";
import pushSubscriptionModel from "../models/pushSubscriptionModel.js";

const sendPushNotification = async ({
  title,
  message,
  userId = null,
  broadcast = false,
  admin = false,
  data = {},
}) => {
  try {
    let subscriptions;

    // Admin notifications
    if (admin) {
      subscriptions = await pushSubscriptionModel.find({
        isAdmin: true,
      });
    }

    // Customer-specific notification
    else if (userId && !broadcast) {
      subscriptions = await pushSubscriptionModel.find({
        userId,
        isAdmin: false,
      });
    }

    // Broadcast notification to customers
    else if (broadcast) {
      subscriptions = await pushSubscriptionModel.find({
        isAdmin: false,
      });
    } else {
      subscriptions = [];
    }

    const payload = JSON.stringify({
      title,
      message,
      ...data,
    });

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
          },
          payload,
        );

        console.log("Push notification sent");
      } catch (error) {
        console.log("Push failed:", error.statusCode, error.message);

        if (error.statusCode === 404 || error.statusCode === 410) {
          await pushSubscriptionModel.deleteOne({
            _id: subscription._id,
          });

          console.log("Removed expired subscription");
        }
      }
    }
  } catch (error) {
    console.log("Push notification error:", error);
  }
};

export default sendPushNotification;
