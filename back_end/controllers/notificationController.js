import notificationModel from "../models/notification.js";

// ============================================================
// GET CUSTOMER NOTIFICATIONS
// ============================================================

const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const notifications = await notificationModel
      .find({
        $or: [
          // Notifications specifically for this customer
          { userId },

          // Notifications meant for all customers
          { isBroadcast: true },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log("GET NOTIFICATIONS ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// MARK CUSTOMER NOTIFICATION AS READ
// ============================================================

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!notificationId) {
      return res.json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const notification = await notificationModel.findOne({
      _id: notificationId,
      $or: [{ userId }, { isBroadcast: true }],
    });

    if (!notification) {
      return res.json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.log("MARK NOTIFICATION READ ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET CUSTOMER UNREAD COUNT
// ============================================================

const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const count = await notificationModel.countDocuments({
      isRead: false,
      $or: [{ userId }, { isBroadcast: true }],
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.log("GET UNREAD COUNT ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET ADMIN NOTIFICATIONS
// ============================================================

const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({
        userId: null,
        isBroadcast: false,
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log("GET ADMIN NOTIFICATIONS ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET ADMIN UNREAD COUNT
// ============================================================

const getAdminUnreadCount = async (req, res) => {
  try {
    const count = await notificationModel.countDocuments({
      userId: null,
      isBroadcast: false,
      isRead: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.log("GET ADMIN UNREAD COUNT ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// MARK ADMIN NOTIFICATION AS READ
// ============================================================

const markAdminAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.json({
        success: false,
        message: "Notification ID is required",
      });
    }

    const notification = await notificationModel.findOne({
      _id: notificationId,
      userId: null,
      isBroadcast: false,
    });

    if (!notification) {
      return res.json({
        success: false,
        message: "Admin notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.json({
      success: true,
      message: "Admin notification marked as read",
    });
  } catch (error) {
    console.log("MARK ADMIN NOTIFICATION READ ERROR:", error);

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
  getNotifications,
  markAsRead,
  getUnreadCount,
  getAdminNotifications,
  getAdminUnreadCount,
  markAdminAsRead,
};
