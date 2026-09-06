import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },

  description: { type: String, required: true },

  price: { type: Number, required: true },

  material: { type: String, required: true },

  seating: { type: String, required: true },

  bestSeller: { type: Boolean, required: true },

  image: { type: [String], required: true },

  date: { type: Date, default: Date.now },

  stock: { type: Boolean, required: true },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
