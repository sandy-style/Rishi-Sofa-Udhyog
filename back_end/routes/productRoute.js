import {
  addProduct,
  singleProduct,
  removeProduct,
  listProducts,
  updateProduct,
  addReview,
} from "../Controllers/productController.js";
import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";
import authUser from "../middleware/auth.js";
const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct,
);

productRouter.post("/removeproduct", adminAuth, removeProduct);
productRouter.get("/listproducts", listProducts);
productRouter.post("/review", authUser, addReview);
productRouter.post("/singleinfo", singleProduct);
productRouter.post(
  "/updateproduct",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 3 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct,
);

export default productRouter;
