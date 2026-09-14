import mongoose, { Schema } from "mongoose";

// =========================
// ADMIN REVIEW REPLY
// =========================
const adminReplySchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },

    signature: {
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
    _id: false,
  },
);

// =========================
// REVIEW
// =========================
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

    adminReply: {
      type: adminReplySchema,
      default: null,
    },
  },
  {
    _id: true,
  },
);

// =========================
// OFFER
// =========================
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

// =========================
// PRODUCT DIMENSIONS
// =========================
const dimensionsSchema = new Schema(
  {
    width: {
      type: Number,
      min: 0,
      default: null,
    },

    length: {
      type: Number,
      min: 0,
      default: null,
    },

    depth: {
      type: Number,
      min: 0,
      default: null,
    },

    height: {
      type: Number,
      min: 0,
      default: null,
    },

    // Used mainly for L-shaped sofas
    leftLength: {
      type: Number,
      min: 0,
      default: null,
    },

    rightLength: {
      type: Number,
      min: 0,
      default: null,
    },

    unit: {
      type: String,
      enum: ["cm", "in", "ft"],
      default: "cm",
    },
  },
  {
    _id: false,
  },
);

// =========================
// PRODUCT
// =========================
const productSchema = new Schema(
  {
    // =========================
    // BASIC INFORMATION
    // =========================
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

    // =========================
    // PRODUCT ATTRIBUTES
    // =========================
    attributes: {
      type: Map,
      of: String,
      default: {},
    },

    // =========================
    // SIZE
    // =========================
    // Examples:
    // Sofa  -> "3 Seater"
    // Sofa  -> "L Shape"
    // Bed   -> "King"
    // Mattress -> "Queen"
    // Table -> "Large"
    size: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // DIMENSIONS
    // =========================
    dimensions: {
      type: dimensionsSchema,
      default: () => ({
        width: null,
        length: null,
        depth: null,
        height: null,
        leftLength: null,
        rightLength: null,
        unit: "cm",
      }),
    },

    // =========================
    // OFFER
    // =========================
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

    // =========================
    // REVIEWS
    // =========================
    reviews: {
      type: [reviewSchema],
      default: [],
    },

    // =========================
    // SOLD COUNT
    // =========================
    // Automatically increased when
    // an order becomes Delivered.
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =========================
    // STOCK
    // =========================
    stock: {
      type: Boolean,
      default: true,
    },

    // =========================
    // IMAGES
    // =========================
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

    // =========================
    // PRODUCT DATE
    // =========================
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
