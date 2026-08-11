import express from "express";
import {
  addToCart,
  updateCart,
  getCartData,
} from "../Controllers/cartController.js";

import authUser from "../middleware/auth.js";

const cartRoute = express.Router();

cartRoute.post("/get", authUser, getCartData);
cartRoute.post("/update", authUser, updateCart);
cartRoute.post("/add", authUser, addToCart);

export default cartRoute;
