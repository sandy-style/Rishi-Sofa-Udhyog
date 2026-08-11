import userModel from "../models/users.js";

// add to cart function
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "added to cart successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// update cart function
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData;
    cartData[itemId] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: false, message: "updated successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// get user cartdata function
const getCartData = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = userModel.findById(userId);
    const cartData = userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
export { addToCart, updateCart, getCartData };
