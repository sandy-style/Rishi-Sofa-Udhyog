import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },

    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const pushSubscriptionModel =
  mongoose.models.pushSubscription ||
  mongoose.model("pushSubscription", pushSubscriptionSchema);

export default pushSubscriptionModel;
