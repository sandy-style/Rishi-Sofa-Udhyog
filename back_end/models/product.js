import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const offerSchema = new Schema(
  {
    isActive: {
      type: Boolean,
      default: false,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    offerTitle: {
      type: String,
      default: "",
      trim: true,
    },
    offerEndsAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Sofas", "Beds", "Almirahs", "Tables", "Tv-units", "Matteress"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    material: {
      type: String,
      required: true,
      trim: true,
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    offer: {
      type: offerSchema,
      default: () => ({
        isActive: false,
        discountType: "percentage",
        discountValue: 0,
        offerTitle: "",
        offerEndsAt: null,
      }),
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Boolean,
      default: true,
    },
    image: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one product image is required",
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
