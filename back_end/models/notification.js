import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    // Specific customer who should receive this notification
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    // Related order, if this is an order notification
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      default: null,
    },

    // Related product, if this is a product notification
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      default: null,
    },

    // true when the notification is meant for all customers
    isBroadcast: {
      type: Boolean,
      default: false,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const notificationModel =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);

export default notificationModel;
