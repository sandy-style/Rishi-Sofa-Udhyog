import { json } from "express";
import productModel from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";
// function to add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      material,

      seating,
      bestSeller,
      stock,
    } = req.body;
    const color = JSON.parse(req.body.color);

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const image = [image1, image2, image3, image4].filter(
      (image) => image != undefined,
    );
    let imageUrl = await Promise.all(
      image.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );
    const productData = {
      name,
      description,
      price: Number(price),
      material,
      seating,
      bestSeller: bestSeller === "true" ? true : false,
      color,
      image: imageUrl,
      stock: stock === "true" ? true : false,
    };
    const product = new productModel(productData);
    await product.save();
    res.json({ success: true, message: "product Added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// function to list products

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove products
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, removeProduct, addProduct, singleProduct };
