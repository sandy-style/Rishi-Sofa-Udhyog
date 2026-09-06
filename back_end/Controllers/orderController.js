import { response } from "express";
import orderModel from "../models/order.js";
import userModel from "../models/users.js";
import notificationModel from "../models/notification.js";
import sendPushNotification from "../config/sendPushNotification.js";
// placing order using cod method
const placeOrder = async (req, res) => {
  try {
    const { items, address, amount } = req.body;
    const userId = req.userId;
    const user = await userModel.findById(userId);
    const customerName = user?.name || "A Customer";
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Create notification
    await notificationModel.create({
      type: "new_order",
      title: "New Order",
      message: `${customerName} placed an order worth Rs. ${amount}`,
      orderId: newOrder._id,
    });

    // 🔔 Send push notification
    await sendPushNotification({
      title: "New Order 🛋️",
      message: "A new customer order has been placed.",
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// placing order using esewa
const placeOrderEsewa = async (req, res) => {};

// place order using khalti
const placeOrderKhalti = async (req, res) => {};

// all orders for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders, message: "successfully retrieved" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderEsewa,
  placeOrderKhalti,
  allOrders,
  userOrders,
  updateStatus,
};
