import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema(
  {
    // Customer who owns this push subscription
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    // True when this subscription belongs to the admin panel
    isAdmin: {
      type: Boolean,
      default: false,
    },

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
