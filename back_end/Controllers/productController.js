import productModel from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/users.js";
import orderModel from "../models/order.js";

const allowedCategories = [
  "Sofas",
  "Beds",
  "Matteress",
  "Almirahs",
  "Tables",
  "Tv-units",
];

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      attributes,
      bestSeller,
      stock,
      offer,
      material,
    } = req.body;

    if (!name || !description || !category || !price || !material) {
      return res.json({
        success: false,
        message: "Please fill all required product details",
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.json({
        success: false,
        message: "Invalid product category",
      });
    }

    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

    if (images.length === 0) {
      return res.json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const imageUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        return result.secure_url;
      }),
    );

    let parsedAttributes = {};

    if (attributes) {
      try {
        parsedAttributes =
          typeof attributes === "string" ? JSON.parse(attributes) : attributes;
      } catch (error) {
        return res.json({
          success: false,
          message: "Invalid product attributes",
        });
      }
    }

    let parsedOffer = {
      isActive: false,
      discountType: "percentage",
      discountValue: 0,
      offerTitle: "",
      offerEndsAt: null,
    };

    if (offer) {
      try {
        parsedOffer = typeof offer === "string" ? JSON.parse(offer) : offer;
      } catch (error) {
        return res.json({
          success: false,
          message: "Invalid offer data",
        });
      }
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      material: material.trim(),
      attributes: parsedAttributes,
      offer: {
        isActive:
          parsedOffer.isActive === true || parsedOffer.isActive === "true",
        discountType:
          parsedOffer.discountType === "flat" ? "flat" : "percentage",
        discountValue: Number(parsedOffer.discountValue || 0),
        offerTitle: parsedOffer.offerTitle
          ? String(parsedOffer.offerTitle).trim()
          : "",
        offerEndsAt: parsedOffer.offerEndsAt
          ? new Date(parsedOffer.offerEndsAt)
          : null,
      },
      bestSeller: bestSeller === true || bestSeller === "true",
      stock: stock === true || stock === "true",
      image: imageUrl,
    };

    const product = new productModel(productData);

    await product.save();

    res.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ date: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      category,
      price,
      attributes,
      bestSeller,
      stock,
      offer,
      material,
    } = req.body;

    if (!id) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    if (category && !allowedCategories.includes(category)) {
      return res.json({
        success: false,
        message: "Invalid product category",
      });
    }

    let parsedAttributes = product.attributes || {};

    if (attributes !== undefined) {
      try {
        parsedAttributes =
          typeof attributes === "string" ? JSON.parse(attributes) : attributes;
      } catch (error) {
        return res.json({
          success: false,
          message: "Invalid product attributes",
        });
      }
    }

    let parsedOffer = product.offer
      ? product.offer.toObject
        ? product.offer.toObject()
        : product.offer
      : {
          isActive: false,
          discountType: "percentage",
          discountValue: 0,
          offerTitle: "",
          offerEndsAt: null,
        };

    if (offer !== undefined) {
      try {
        parsedOffer = typeof offer === "string" ? JSON.parse(offer) : offer;
      } catch (error) {
        return res.json({
          success: false,
          message: "Invalid offer data",
        });
      }
    }

    product.name = name?.trim() || product.name;
    product.description = description?.trim() || product.description;
    product.category = category || product.category;
    product.price =
      price !== undefined && price !== "" ? Number(price) : product.price;
    product.material = material?.trim() || product.material;

    product.attributes = parsedAttributes;

    product.offer = {
      isActive:
        parsedOffer.isActive === true || parsedOffer.isActive === "true",
      discountType: parsedOffer.discountType === "flat" ? "flat" : "percentage",
      discountValue: Number(parsedOffer.discountValue || 0),
      offerTitle: parsedOffer.offerTitle
        ? String(parsedOffer.offerTitle).trim()
        : "",
      offerEndsAt: parsedOffer.offerEndsAt
        ? new Date(parsedOffer.offerEndsAt)
        : null,
    };

    if (bestSeller !== undefined) {
      product.bestSeller = bestSeller === true || bestSeller === "true";
    }

    if (stock !== undefined) {
      product.stock = stock === true || stock === "true";
    }

    let images = [...(product.image || [])];

    const imageKeys = ["image1", "image2", "image3", "image4"];

    for (let i = 0; i < imageKeys.length; i++) {
      if (req.files?.[imageKeys[i]]?.[0]) {
        const result = await cloudinary.uploader.upload(
          req.files[imageKeys[i]][0].path,
          {
            resource_type: "image",
          },
        );

        images[i] = result.secure_url;
      }
    }

    product.image = images.filter(Boolean);

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.userId;

    // ==============================
    // VALIDATION
    // ==============================

    if (!userId) {
      return res.json({
        success: false,
        message: "Please login to review this product",
      });
    }

    if (!productId) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.json({
        success: false,
        message: "Please write a review",
      });
    }

    if (comment.trim().length < 5) {
      return res.json({
        success: false,
        message: "Review must contain at least 5 characters",
      });
    }

    // ==============================
    // GET USER
    // ==============================

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // ==============================
    // GET PRODUCT
    // ==============================

    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    // ==============================
    // CHECK DELIVERED PURCHASE
    // ==============================

    const orders = await orderModel.find({
      userId: userId.toString(),
    });

    const hasPurchased = orders.some(
      (order) =>
        order.status === "Delivered" &&
        (order.items || []).some((item) => {
          const orderedProductId =
            item.productId || item.product || item._id || item.id;

          return (
            orderedProductId &&
            orderedProductId.toString() === productId.toString()
          );
        }),
    );

    if (!hasPurchased) {
      return res.json({
        success: false,
        message: "You can only review products after they are delivered",
      });
    }

    // ==============================
    // CHECK EXISTING REVIEW
    // ==============================

    const alreadyReviewed = (product.reviews || []).find(
      (review) => review.user && review.user.toString() === userId.toString(),
    );

    if (alreadyReviewed) {
      return res.json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // ==============================
    // NEW REVIEW
    // ==============================

    const newReview = {
      user: userId,
      name: user.name,
      rating: Number(rating),
      comment: comment.trim(),
      date: new Date(),
    };

    // Use $push so Mongoose does not validate
    // the entire Product document.

    await productModel.updateOne(
      { _id: productId },
      {
        $push: {
          reviews: newReview,
        },
      },
    );

    return res.json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    console.log("ADD REVIEW ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const editReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.userId;

    // ==============================
    // VALIDATION
    // ==============================

    if (!userId) {
      return res.json({
        success: false,
        message: "Please login to edit your review",
      });
    }

    if (!productId) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.json({
        success: false,
        message: "Please write a review",
      });
    }

    if (comment.trim().length < 5) {
      return res.json({
        success: false,
        message: "Review must contain at least 5 characters",
      });
    }

    // ==============================
    // GET PRODUCT
    // ==============================

    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    // ==============================
    // FIND USER'S REVIEW
    // ==============================

    const review = (product.reviews || []).find(
      (review) => review.user && review.user.toString() === userId.toString(),
    );

    if (!review) {
      return res.json({
        success: false,
        message: "You have not reviewed this product yet",
      });
    }

    // ==============================
    // UPDATE ONLY USER'S REVIEW
    // ==============================

    const result = await productModel.updateOne(
      {
        _id: productId,
        "reviews._id": review._id,
        "reviews.user": userId,
      },
      {
        $set: {
          "reviews.$.rating": Number(rating),
          "reviews.$.comment": comment.trim(),
          "reviews.$.date": new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.json({
        success: false,
        message: "Unable to update review",
      });
    }

    return res.json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.log("EDIT REVIEW ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const replyToReview = async (req, res) => {
  try {
    const { productId, reviewId, comment } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!productId || !reviewId) {
      return res.json({
        success: false,
        message: "Product ID and review ID are required",
      });
    }

    if (!comment || !comment.trim()) {
      return res.json({
        success: false,
        message: "Reply comment is required",
      });
    }

    if (comment.trim().length < 2) {
      return res.json({
        success: false,
        message: "Reply must contain at least 2 characters",
      });
    }

    // ==============================
    // CHECK PRODUCT
    // ==============================

    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    // ==============================
    // CHECK REVIEW
    // ==============================

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.json({
        success: false,
        message: "Review not found",
      });
    }

    // ==============================
    // ADMIN SIGNATURE
    // ==============================

    const signature =
      "ADMIN-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // ==============================
    // UPDATE ONLY THIS REVIEW
    // ==============================

    const result = await productModel.updateOne(
      {
        _id: productId,
        "reviews._id": reviewId,
      },
      {
        $set: {
          "reviews.$.adminReply": {
            comment: comment.trim(),
            signature,
            date: new Date(),
          },
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.json({
        success: false,
        message: "Unable to save reply",
      });
    }

    return res.json({
      success: true,
      message: "Reply added successfully",
      signature,
    });
  } catch (error) {
    console.log("REPLY REVIEW ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};
const myReview = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "Please login",
      });
    }

    if (!productId) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    const review = (product.reviews || []).find(
      (review) => review.user && review.user.toString() === userId.toString(),
    );

    return res.json({
      success: true,
      review: review || null,
    });
  } catch (error) {
    console.log("MY REVIEW ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  listProducts,
  removeProduct,
  addProduct,
  singleProduct,
  updateProduct,
  addReview,
  editReview,
  replyToReview,
  myReview,
};
