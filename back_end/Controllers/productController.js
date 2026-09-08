import productModel from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";

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
    const { productId, rating, comment, name } = req.body;

    const userId = req.userId;

    if (!productId) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.json({
        success: false,
        message: "Review comment is required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user && review.user.toString() === userId.toString(),
    );

    if (alreadyReviewed) {
      return res.json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    product.reviews.push({
      user: userId,
      name: name || "Customer",
      rating: Number(rating),
      comment: comment.trim(),
    });

    await product.save();

    res.json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    console.log(error);

    res.json({
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
};
