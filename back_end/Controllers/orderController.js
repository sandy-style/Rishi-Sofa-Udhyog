import { response } from "express";
import orderModel from "../models/order.js";
import userModel from "../models/users.js";
// placing order using cod method
const placeOrder = async (req, res) => {
  try {
    const { items, address, amount } = req.body;
    const userId = req.userId;
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
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order placed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// placing order using esewa
const placeOrderEsewa = async (req, res) => {};

// place order using khalti
const placeOrderKhalti = async (req, res) => {};

// all orders for admin panel
const allOrders = async (req, res) => {};

// User order data for frontend
const userOrders = async (req, res) => {};

// update order status from admin panel
const updateStatus = async (req, res) => {};

export {
  placeOrder,
  placeOrderEsewa,
  placeOrderKhalti,
  allOrders,
  userOrders,
  updateStatus,
};
