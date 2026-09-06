import webpush from "./webPush.js";
import pushSubscriptionModel from "../models/pushSubscriptionModel.js";

const sendPushNotification = async ({ title, message }) => {
  try {
    const subscriptions = await pushSubscriptionModel.find();

    const payload = JSON.stringify({
      title,
      message,
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

        // Subscription is no longer valid
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
