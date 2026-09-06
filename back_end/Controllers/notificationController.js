import notificationModel from "../models/notification.js";

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    await notificationModel.findByIdAndUpdate(notificationId, { isRead: true });

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationModel.countDocuments({
      isRead: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export { getNotifications, markAsRead, getUnreadCount };
