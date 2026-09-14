import orderModel from "../models/order.js";
import userModel from "../models/users.js";
import productModel from "../models/product.js";
import notificationModel from "../models/notification.js";
import sendPushNotification from "../config/sendPushNotification.js";

// ============================================================
// PLACE ORDER - COD
// ============================================================

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

    // ==============================
    // CREATE NOTIFICATION
    // ==============================

    await notificationModel.create({
      type: "new_order",
      title: "New Order",
      message: `${customerName} placed an order worth Rs. ${amount}`,
      orderId: newOrder._id,
    });

    // ==============================
    // SEND PUSH NOTIFICATION
    // ==============================

    await sendPushNotification({
      admin: true,
      title: "New Order 🛋️",
      message: "A new customer order has been placed.",
      data: {
        type: "new_order",
        orderId: newOrder._id,
      },
    });

    // ==============================
    // CLEAR USER CART
    // ==============================

    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
    });

    res.json({
      success: true,
      message: "Order placed",
    });
  } catch (error) {
    console.log("PLACE ORDER ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// PLACE ORDER - ESEWA
// ============================================================

const placeOrderEsewa = async (req, res) => {};

// ============================================================
// PLACE ORDER - KHALTI
// ============================================================

const placeOrderKhalti = async (req, res) => {};

// ============================================================
// ALL ORDERS - ADMIN
// ============================================================

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    res.json({
      success: true,
      orders,
      message: "Successfully retrieved",
    });
  } catch (error) {
    console.log("ALL ORDERS ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// USER ORDERS
// ============================================================

const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel.find({ userId });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("USER ORDERS ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!orderId) {
      return res.json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!status) {
      return res.json({
        success: false,
        message: "Order status is required",
      });
    }

    // ==============================
    // GET ORDER
    // ==============================

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    // ==============================
    // PREVIOUS STATUS
    // ==============================

    const previousStatus = order.status;

    // ==============================
    // UPDATE ORDER STATUS
    // ==============================

    order.status = status;

    await order.save();

    // ========================================================
    // CUSTOMER NOTIFICATION
    // ========================================================
    //
    // Notify only the customer who owns this order when the
    // order changes to "Out for Delivery".
    //
    // We check previousStatus so the customer does not receive
    // the same notification repeatedly.
    //
    // ========================================================

    if (
      status === "Out for Delivery" &&
      previousStatus !== "Out for Delivery"
    ) {
      // Save notification in database
      await notificationModel.create({
        type: "out_for_delivery",
        title: "Out for Delivery 🚚",
        message: "Your order is out for delivery.",
        userId: order.userId,
        orderId: order._id,
      });

      // Send push notification only to this customer
      await sendPushNotification({
        userId: order.userId,
        title: "Out for Delivery 🚚",
        message: "Your order is out for delivery.",
        data: {
          type: "out_for_delivery",
          orderId: order._id,
        },
      });
    }

    // ========================================================
    // INCREASE PRODUCT SALES COUNT
    // ========================================================
    //
    // Only count a product as sold when the order becomes
    // Delivered.
    //
    // IMPORTANT:
    // We check previousStatus so the same order cannot
    // increase soldCount more than once.
    //
    // ========================================================

    if (status === "Delivered" && previousStatus !== "Delivered") {
      const items = order.items || [];

      for (const item of items) {
        const productId = item.productId || item.product || item._id || item.id;

        const quantity = Number(item.quantity || item.qty || 1);

        if (!productId) {
          console.log("Product ID missing from order item:", item);
          continue;
        }

        if (!Number.isFinite(quantity) || quantity <= 0) {
          continue;
        }

        await productModel.findByIdAndUpdate(productId, {
          $inc: {
            soldCount: quantity,
          },
        });
      }
    }

    // ==============================
    // RESPONSE
    // ==============================

    res.json({
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    console.log("UPDATE STATUS ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// EXPORT
// ============================================================

export {
  placeOrder,
  placeOrderEsewa,
  placeOrderKhalti,
  allOrders,
  userOrders,
  updateStatus,
};
