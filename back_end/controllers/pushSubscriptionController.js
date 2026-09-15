import pushSubscriptionModel from "../models/pushSubscriptionModel.js";

const saveSubscription = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.json({
        success: false,
        message: "Invalid push subscription",
      });
    }

    await pushSubscriptionModel.findOneAndUpdate(
      { endpoint },
      {
        userId,
        endpoint,
        keys,
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    res.json({
      success: true,
      message: "Push subscription saved",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
const saveAdminSubscription = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.json({
        success: false,
        message: "Invalid push subscription",
      });
    }

    await pushSubscriptionModel.findOneAndUpdate(
      { endpoint },
      {
        userId: null,
        isAdmin: true,
        endpoint,
        keys,
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    res.json({
      success: true,
      message: "Admin push subscription saved",
    });
  } catch (error) {
    console.log("SAVE ADMIN SUBSCRIPTION ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { saveSubscription, saveAdminSubscription };
