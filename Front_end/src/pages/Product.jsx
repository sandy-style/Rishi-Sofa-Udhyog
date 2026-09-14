import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import { ShopContext } from "../context/shopContext";
import RelatedProducts from "../components/RelatedProducts";
import Review from "../components/Review";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiTag,
  FiUser,
  FiMessageCircle,
  FiShield,
  FiPenTool,
} from "react-icons/fi";

import { backendUrl } from "../App";

const Product = ({ token, setShowLogin }) => {
  const { productId } = useParams();

  const { products, currency, addToCart, getProductsFromCart } =
    useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [deliveredOrder, setDeliveredOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasMyReview, setHasMyReview] = useState(false);

  const getUserIdFromToken = (tokenValue) => {
    try {
      if (!tokenValue) return null;

      const payload = JSON.parse(atob(tokenValue.split(".")[1]));

      return payload.userId || payload.id || payload._id || null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!products?.length) return;

    const product = products.find((item) => item._id === productId);

    if (product) {
      setProductData(product);
      setImage(product.image?.[0] || "");
      setActiveImageIndex(0);
    }
  }, [products, productId]);

  useEffect(() => {
    getProductsFromCart();
  }, [productId]);

  useEffect(() => {
    const checkDeliveredOrder = async () => {
      if (!token || !productId) {
        setDeliveredOrder(null);
        return;
      }

      try {
        const response = await axios.post(
          backendUrl + "/api/order/userorders",
          {},
          {
            headers: {
              token,
            },
          },
        );

        if (!response.data.success) {
          setDeliveredOrder(null);
          return;
        }

        const orders = Array.isArray(response.data.orders)
          ? response.data.orders
          : [];

        const matchingDeliveredOrder = orders.find((order) => {
          if (order.status !== "Delivered") {
            return false;
          }

          if (!Array.isArray(order.items)) {
            return false;
          }

          return order.items.some((item) => {
            const itemProductId =
              item?.productId || item?.product || item?._id || item?.id;

            return String(itemProductId) === String(productId);
          });
        });

        setDeliveredOrder(matchingDeliveredOrder || null);
      } catch (error) {
        console.error("Check delivered order error:", error);
        setDeliveredOrder(null);
      }
    };

    checkDeliveredOrder();
  }, [token, productId]);

  useEffect(() => {
    if (!token || !productData?.reviews) {
      setHasMyReview(false);
      return;
    }

    const userId = getUserIdFromToken(token);

    if (!userId) {
      setHasMyReview(false);
      return;
    }

    const myReview = productData.reviews.some(
      (review) => review.user && String(review.user) === String(userId),
    );

    setHasMyReview(myReview);
  }, [token, productData]);

  const isInStock =
    productData?.stock === true ||
    productData?.stock === "true" ||
    productData?.stock === 1 ||
    productData?.stock === "1";

  const isBestSeller =
    productData?.soldCount > 0 ||
    productData?.bestSeller === true ||
    productData?.bestSeller === "true" ||
    productData?.bestSeller === 1 ||
    productData?.bestSeller === "1";

  const offerIsActive =
    productData?.offer?.isActive === true ||
    productData?.offer?.isActive === "true" ||
    productData?.offer?.isActive === 1 ||
    productData?.offer?.isActive === "1";

  const originalPrice = Math.max(0, Number(productData?.price) || 0);

  const discountValue = Math.max(
    0,
    Number(productData?.offer?.discountValue) || 0,
  );

  const discountType = productData?.offer?.discountType;

  const isOfferActive =
    offerIsActive &&
    discountValue > 0 &&
    (discountType === "percentage" || discountType === "flat");

  let finalPrice = originalPrice;
  let discountAmount = 0;
  let discountPercentage = 0;

  if (isOfferActive) {
    if (discountType === "percentage") {
      discountPercentage = Math.min(100, discountValue);
      discountAmount = (originalPrice * discountPercentage) / 100;
      finalPrice = originalPrice - discountAmount;
    }

    if (discountType === "flat") {
      discountAmount = Math.min(originalPrice, discountValue);
      finalPrice = originalPrice - discountAmount;

      discountPercentage =
        originalPrice > 0
          ? Math.round((discountAmount / originalPrice) * 100)
          : 0;
    }

    finalPrice = Math.max(0, finalPrice);
  }

  const formattedCategory = productData?.category
    ? String(productData.category)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "";

  const reviews = Array.isArray(productData?.reviews)
    ? productData.reviews
    : [];

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviewCount
      : 0;

  const formattedAverageRating =
    reviewCount > 0 ? averageRating.toFixed(1) : "0.0";

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter(
        (review) => Number(review.rating) === star,
      ).length;

      const percentage =
        reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;

      return {
        star,
        count,
        percentage,
      };
    });
  }, [reviews, reviewCount]);

  const formatReviewDate = (date) => {
    if (!date) return "Recently";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const productDetails = useMemo(() => {
    if (!productData) return [];

    const details = [];

    const category = String(productData.category || "").toLowerCase();

    const attributes =
      productData.attributes && typeof productData.attributes === "object"
        ? productData.attributes
        : {};

    const addDetail = (label, value) => {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        details.push([label, value]);
      }
    };

    if (category === "matteress" || category === "mattress") {
      addDetail("Mattress Type", attributes.mattressType);
      addDetail("Size", productData.size || attributes.size);
      addDetail("Thickness", attributes.thickness);
      addDetail("Firmness", attributes.firmness);
      addDetail("Material", productData.material);
      addDetail("Color", attributes.color);
      addDetail("Style", attributes.style);
    } else {
      addDetail("Seating", attributes.seating || productData.seating);
      addDetail("Size", productData.size || attributes.size);
      addDetail("Material", productData.material);
      addDetail("Color", attributes.color);
      addDetail("Style", attributes.style);
    }

    const dimensions = productData.dimensions;

    if (dimensions && typeof dimensions === "object") {
      const unit = dimensions.unit || "cm";

      addDetail(
        "Width",
        dimensions.width !== null &&
          dimensions.width !== undefined &&
          dimensions.width !== ""
          ? `${dimensions.width} ${unit}`
          : null,
      );

      addDetail(
        "Length",
        dimensions.length !== null &&
          dimensions.length !== undefined &&
          dimensions.length !== ""
          ? `${dimensions.length} ${unit}`
          : null,
      );

      addDetail(
        "Depth",
        dimensions.depth !== null &&
          dimensions.depth !== undefined &&
          dimensions.depth !== ""
          ? `${dimensions.depth} ${unit}`
          : null,
      );

      addDetail(
        "Height",
        dimensions.height !== null &&
          dimensions.height !== undefined &&
          dimensions.height !== ""
          ? `${dimensions.height} ${unit}`
          : null,
      );

      addDetail(
        "Left Length",
        dimensions.leftLength !== null &&
          dimensions.leftLength !== undefined &&
          dimensions.leftLength !== ""
          ? `${dimensions.leftLength} ${unit}`
          : null,
      );

      addDetail(
        "Right Length",
        dimensions.rightLength !== null &&
          dimensions.rightLength !== undefined &&
          dimensions.rightLength !== ""
          ? `${dimensions.rightLength} ${unit}`
          : null,
      );
    }

    return details;
  }, [productData]);

  const handleAddToCart = () => {
    if (!isInStock) return;

    if (!token) {
      setShowLogin(true);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(productId, token);
    }
  };

  const handlePreviousImage = () => {
    if (!productData?.image?.length) return;

    const total = productData.image.length;

    const nextIndex = activeImageIndex === 0 ? total - 1 : activeImageIndex - 1;

    setActiveImageIndex(nextIndex);
    setImage(productData.image[nextIndex]);
  };

  const handleNextImage = () => {
    if (!productData?.image?.length) return;

    const total = productData.image.length;

    const nextIndex = activeImageIndex === total - 1 ? 0 : activeImageIndex + 1;

    setActiveImageIndex(nextIndex);
    setImage(productData.image[nextIndex]);
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => Math.min(prev + 1, 10));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleReviewAction = () => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    if (!deliveredOrder) {
      return;
    }

    setShowReviewModal(true);
  };

  const handleCloseReview = () => {
    setShowReviewModal(false);
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    window.location.reload();
  };

  if (!productData) {
    return (
      <div className="min-h-[70vh] animate-pulse px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-[24px] bg-[#F1ECE6]" />

          <div className="space-y-5">
            <div className="h-4 w-32 rounded-full bg-[#F1ECE6]" />
            <div className="h-12 w-3/4 rounded-xl bg-[#F1ECE6]" />
            <div className="h-6 w-40 rounded-full bg-[#F1ECE6]" />
            <div className="h-10 w-48 rounded-xl bg-[#F1ECE6]" />
            <div className="h-24 rounded-xl bg-[#F1ECE6]" />
            <div className="h-16 rounded-xl bg-[#F1ECE6]" />
            <div className="h-14 rounded-xl bg-[#F1ECE6]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="border-t border-[#E9DED2] bg-[#FCFAF7]">
      <div className="mx-auto max-w-[1550px] px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8 xl:px-10">
        <div className="font-beautify mb-6 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#9A8878] sm:mb-8 sm:text-[11px]">
          <Link to="/" className="transition-colors hover:text-[#634936]">
            Home
          </Link>

          <span>/</span>

          <Link
            to="/collection"
            className="transition-colors hover:text-[#634936]"
          >
            Collection
          </Link>

          <span>/</span>

          <span className="truncate text-[#634936]">{productData.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-12 xl:grid-cols-[minmax(0,1.08fr)_minmax(500px,0.92fr)] xl:gap-16">
          <section className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="order-2 flex w-full gap-2 overflow-x-auto pb-1 sm:order-1 sm:w-[92px] sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden sm:pb-0 lg:w-[100px]">
                {productData.image?.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setImage(item);
                      setActiveImageIndex(index);
                    }}
                    className={`group relative aspect-square w-[72px] shrink-0 overflow-hidden rounded-[12px] border bg-[#F5F0EA] transition-all duration-300 sm:w-full ${
                      activeImageIndex === index
                        ? "border-[#8C684B] shadow-[0_8px_20px_rgba(76,52,36,0.12)]"
                        : "border-[#E5D9CD] hover:border-[#BDA58F]"
                    }`}
                  >
                    <img
                      src={item}
                      alt={`${productData.name} ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />

                    {activeImageIndex === index && (
                      <span className="absolute inset-x-2 bottom-1 h-[2px] rounded-full bg-[#8C684B] sm:inset-x-3" />
                    )}
                  </button>
                ))}
              </div>

              <div className="order-1 min-w-0 flex-1 sm:order-2">
                <div className="relative overflow-hidden rounded-[20px] border border-[#E6DCD1] bg-[#F3EEE8] shadow-[0_18px_50px_rgba(73,51,35,0.07)] sm:rounded-[24px] lg:rounded-[28px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),transparent_65%)]" />

                  <div className="relative flex min-h-[340px] items-center justify-center p-5 sm:min-h-[500px] sm:p-8 lg:min-h-[600px] xl:min-h-[650px]">
                    <img
                      src={image}
                      alt={productData.name}
                      className="h-full max-h-[560px] w-full object-contain drop-shadow-[0_24px_28px_rgba(48,35,26,0.13)] transition-transform duration-500 hover:scale-[1.025]"
                    />

                    {productData.image?.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePreviousImage}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#634936] shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-[#634936] hover:text-white sm:left-5 sm:h-11 sm:w-11"
                        >
                          <FiArrowLeft className="text-sm sm:text-base" />
                        </button>

                        <button
                          type="button"
                          onClick={handleNextImage}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#634936] shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-[#634936] hover:text-white sm:right-5 sm:h-11 sm:w-11"
                        >
                          <FiArrowRight className="text-sm sm:text-base" />
                        </button>
                      </>
                    )}

                    {isOfferActive && (
                      <div className="absolute left-2 top-2 sm:left-5 sm:top-5">
                        <div className="flex items-center gap-1 rounded-full bg-[#B91C1C] px-2 py-1 text-white shadow-[0_6px_15px_rgba(127,29,29,0.22)] sm:gap-1.5 sm:px-4 sm:py-2">
                          <FiTag className="text-[8px] sm:text-xs" />

                          <span className="font-beautify text-[7px] font-bold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-[0.12em]">
                            {discountPercentage}% Off
                          </span>
                        </div>
                      </div>
                    )}

                    {!isInStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#30231B]/20 backdrop-blur-[2px]">
                        <span className="font-beautify rounded-full bg-white px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#634936] shadow-xl sm:px-5 sm:py-2.5 sm:text-[10px]">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 backdrop-blur-md sm:bottom-5">
                    {productData.image?.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setImage(productData.image[index]);
                          setActiveImageIndex(index);
                        }}
                        aria-label={`View image ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeImageIndex === index
                            ? "w-5 bg-[#634936]"
                            : "w-1.5 bg-[#C7B6A5]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="min-w-0 lg:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {formattedCategory && (
                <span className="font-beautify rounded-full bg-[#EEE5DB] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#80634B] sm:px-4 sm:text-[10px]">
                  {formattedCategory}
                </span>
              )}

              {isBestSeller && (
                <span className="font-beautify inline-flex items-center gap-1.5 rounded-full bg-[#634936] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white sm:px-4 sm:text-[10px] sm:tracking-[0.14em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Best Seller
                </span>
              )}
            </div>

            {isOfferActive && productData.offer?.offerTitle && (
              <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-[10px] border border-[#E7C8C3] bg-[#FFF6F4] px-3 py-2 sm:px-4">
                <FiTag className="shrink-0 text-sm text-[#B91C1C]" />

                <span className="font-beautify truncate text-[9px] font-bold uppercase tracking-[0.1em] text-[#9B3029] sm:text-[11px] sm:tracking-[0.12em]">
                  {productData.offer.offerTitle}
                </span>
              </div>
            )}

            <h1 className="mt-4 max-w-[760px] font-serif text-[34px] font-medium leading-[1.03] tracking-[-0.045em] text-[#30231B] sm:mt-5 sm:text-[44px] md:text-[50px] lg:text-[54px] xl:text-[60px]">
              {productData.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[#E7DDD3] pb-5">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-base sm:text-lg ${
                      star <= Math.round(averageRating)
                        ? "text-[#C38B43]"
                        : "text-[#D8CCBF]"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <span className="font-manrope text-xs font-bold text-[#634936] sm:text-sm">
                {reviewCount > 0 ? formattedAverageRating : "No ratings"}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#C8B7A5]" />

              <button
                type="button"
                onClick={() => {
                  document.getElementById("reviews")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="font-beautify text-xs font-medium text-[#806F62] underline-offset-4 transition hover:text-[#634936] hover:underline sm:text-sm"
              >
                {reviewCount > 0
                  ? `${reviewCount} Customer ${
                      reviewCount === 1 ? "Review" : "Reviews"
                    }`
                  : "Customer Reviews"}
              </button>
            </div>

            <div className="mt-6 border-b border-[#E7DDD3] pb-6 sm:mt-7 sm:pb-7">
              <p className="font-beautify text-[9px] font-bold uppercase tracking-[0.2em] text-[#A18C79] sm:text-[10px]">
                {isOfferActive ? "Special Price" : "Price"}
              </p>

              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="font-manrope text-[32px] font-bold leading-none tracking-[-0.045em] text-[#63432F] sm:text-[38px] lg:text-[42px]">
                  {currency}
                  {Math.round(finalPrice).toLocaleString("en-IN")}
                </span>

                {isOfferActive && (
                  <span className="font-beautify text-sm font-medium text-[#A18C79] line-through sm:text-base">
                    {currency}
                    {Math.round(originalPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {isOfferActive && (
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <span className="font-beautify inline-flex items-center gap-1.5 rounded-full bg-[#EFE6DC] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#634936] sm:text-[10px]">
                    <FiTag className="text-[10px]" />
                    Save {currency}
                    {Math.round(discountAmount).toLocaleString("en-IN")}
                  </span>

                  <span className="font-beautify text-[10px] font-semibold text-[#718466] sm:text-xs">
                    You save {discountPercentage}%
                  </span>
                </div>
              )}
            </div>

            {productData.description && (
              <div className="mt-6 sm:mt-7">
                <p className="font-beautify text-xs leading-6 text-[#71655D] sm:text-sm sm:leading-6">
                  {productData.description}
                </p>
              </div>
            )}

            <div className="mt-7 sm:mt-8">
              <div className="mb-4">
                <p className="font-beautify text-[9px] font-bold uppercase tracking-[0.2em] text-[#A18C79] sm:text-[10px]">
                  Product Information
                </p>

                <h2 className="mt-1 font-serif text-[25px] font-medium tracking-[-0.025em] text-[#30231B] sm:text-[30px]">
                  Details
                </h2>
              </div>

              {productDetails.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {productDetails.map(([label, value], index) => (
                    <div
                      key={`${label}-${index}`}
                      className="rounded-[14px] border border-[#E7DDD3] bg-[#FBF8F4] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4C1AF] hover:shadow-[0_10px_25px_rgba(73,51,35,0.06)] sm:rounded-[16px] sm:p-5"
                    >
                      <p className="font-beautify text-[8px] font-bold uppercase tracking-[0.18em] text-[#A18C79] sm:text-[9px]">
                        {label}
                      </p>

                      <p className="mt-2 break-words font-serif text-sm font-medium capitalize leading-5 text-[#30231B] sm:text-base">
                        {String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[16px] border border-[#E7DDD3] bg-[#FBF8F4] p-5">
                  <p className="font-beautify text-xs text-[#806F62]">
                    Product specifications will be available soon.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-7 border-t border-[#E7DDD3] pt-6 sm:mt-8 sm:pt-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-beautify text-[9px] font-bold uppercase tracking-[0.18em] text-[#A18C79] sm:text-[10px]">
                    Quantity
                  </p>

                  <div className="mt-2 inline-flex items-center rounded-full border border-[#DCCFC1] bg-[#FBF8F4]">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center text-[#634936] transition hover:bg-[#F0E7DD] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus className="text-sm" />
                    </button>

                    <span className="font-manrope flex h-10 min-w-10 items-center justify-center border-x border-[#E1D6CB] px-2 text-sm font-bold text-[#30231B]">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= 10}
                      className="flex h-10 w-10 items-center justify-center text-[#634936] transition hover:bg-[#F0E7DD] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <FiPlus className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-beautify text-[9px] font-bold uppercase tracking-[0.18em] text-[#A18C79] sm:text-[10px]">
                    Availability
                  </p>

                  <p
                    className={`font-beautify mt-2 text-xs font-semibold ${
                      isInStock ? "text-[#718466]" : "text-[#B04A42]"
                    }`}
                  >
                    {isInStock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`group relative mt-5 flex h-14 w-full items-center justify-center overflow-hidden rounded-[12px] px-6 font-manrope text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(105,72,42,0.18)] transition-all duration-300 sm:h-16 sm:text-base ${
                  isInStock
                    ? "bg-[#C99658] hover:-translate-y-0.5 hover:bg-[#B98548] hover:shadow-[0_18px_35px_rgba(105,72,42,0.24)]"
                    : "cursor-not-allowed bg-[#B8ACA1]"
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isInStock ? "Add to Cart" : "Out of Stock"}

                  {isInStock ? (
                    <FiShoppingCart className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
                  ) : (
                    <FiCheck className="text-lg" />
                  )}
                </span>
              </button>

              <p className="font-beautify mt-3 text-center text-[9px] uppercase tracking-[0.12em] text-[#A18C79] sm:text-[10px]">
                Secure your order while stock is available
              </p>
            </div>
          </section>
        </div>

        <section
          id="reviews"
          className="mt-16 border-t border-[#E7DDD3] pt-10 sm:mt-20 sm:pt-14"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-[#9A795B]">
                Customer Experience
              </p>

              <h2 className="mt-1 font-serif text-[30px] font-medium tracking-[-0.035em] text-[#30231B] sm:text-[38px]">
                What Our Customers Say
              </h2>

              <p className="font-beautify mt-2 max-w-[650px] text-sm leading-6 text-[#806F62]">
                Reviews are shared by customers who purchased this product and
                received their order.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
              {reviewCount > 0 && (
                <div className="flex items-center gap-2 rounded-full border border-[#E4D8CC] bg-[#F8F3ED] px-4 py-2">
                  <FiMessageCircle className="text-sm text-[#8A684C]" />

                  <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.12em] text-[#634936]">
                    {reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}
                  </span>
                </div>
              )}

              {token && deliveredOrder && (
                <button
                  type="button"
                  onClick={handleReviewAction}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#634936] px-5 py-2.5 font-manrope text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_8px_20px_rgba(73,51,35,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4D3829] hover:shadow-[0_12px_25px_rgba(73,51,35,0.2)]"
                >
                  <FiPenTool className="text-sm transition-transform duration-300 group-hover:rotate-[-8deg]" />

                  {hasMyReview ? "Edit Review" : "Write a Review"}
                </button>
              )}
            </div>
          </div>

          {reviewCount > 0 ? (
            <>
              <div className="mt-8 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                <div className="rounded-[22px] border border-[#E5D9CE] bg-[#FBF8F4] p-6 sm:p-7">
                  <p className="font-beautify text-[9px] font-bold uppercase tracking-[0.18em] text-[#A18C79]">
                    Overall Rating
                  </p>

                  <div className="mt-4 flex items-end gap-3">
                    <span className="font-serif text-[56px] font-medium leading-none tracking-[-0.06em] text-[#30231B]">
                      {formattedAverageRating}
                    </span>

                    <span className="font-beautify mb-1 text-xs text-[#8D7B6D]">
                      out of 5
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= Math.round(averageRating)
                            ? "text-[#C99658]"
                            : "text-[#D8CCBF]"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="font-beautify mt-3 text-xs leading-5 text-[#8D7B6D]">
                    Based on {reviewCount} customer{" "}
                    {reviewCount === 1 ? "experience" : "experiences"}.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[#E5D9CE] bg-white p-6 sm:p-7">
                  <div>
                    <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.16em] text-[#634936]">
                      Rating Breakdown
                    </p>

                    <p className="font-beautify mt-1 text-xs text-[#9A8878]">
                      See how customers rated this product.
                    </p>
                  </div>

                  <div className="mt-5 space-y-3">
                    {ratingCounts.map(({ star, count, percentage }) => (
                      <div key={star} className="flex items-center gap-3">
                        <div className="flex w-10 shrink-0 items-center gap-1">
                          <span className="font-manrope text-xs font-semibold text-[#634936]">
                            {star}
                          </span>

                          <span className="text-xs text-[#C99658]">★</span>
                        </div>

                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEE7DF]">
                          <div
                            className="h-full rounded-full bg-[#C99658] transition-all duration-700"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <span className="font-beautify w-10 text-right text-[11px] text-[#8D7B6D]">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4">
                  <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.16em] text-[#634936]">
                    Customer Reviews
                  </p>

                  <p className="font-beautify mt-1 text-xs text-[#9A8878]">
                    Real feedback from customers who purchased this product.
                  </p>
                </div>

                <div className="grid gap-4">
                  {reviews.map((review, index) => {
                    const rating = Math.min(
                      5,
                      Math.max(0, Number(review.rating) || 0),
                    );

                    const adminReply = review.adminReply;

                    const replyText =
                      adminReply?.message ||
                      adminReply?.comment ||
                      adminReply?.text ||
                      adminReply?.reply ||
                      "";

                    return (
                      <article
                        key={review._id || `${review.user}-${index}`}
                        className="rounded-[20px] border border-[#E5D9CE] bg-white p-5 transition-all duration-300 hover:border-[#D4C1AF] hover:shadow-[0_12px_30px_rgba(73,51,35,0.06)] sm:p-6"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEE5DB] text-[#765B45]">
                              <FiUser className="text-base" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-manrope text-sm font-bold text-[#30231B]">
                                  {review.name || "Customer"}
                                </p>
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="font-beautify text-[10px] text-[#9A8878]">
                                  {formatReviewDate(review.date)}
                                </span>

                                <span className="h-1 w-1 rounded-full bg-[#CBBBAA]" />

                                <span className="inline-flex items-center gap-1 font-beautify text-[10px] font-semibold text-[#718466]">
                                  <FiShield className="text-[10px]" />
                                  Verified Purchase
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= rating
                                    ? "text-[#C99658]"
                                    : "text-[#DDD2C7]"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 rounded-[14px] bg-[#FBF8F4] px-4 py-4">
                          <p className="font-beautify text-sm leading-6 text-[#62564D]">
                            {review.comment}
                          </p>
                        </div>

                        {replyText && (
                          <div className="mt-5 rounded-[15px] border border-[#E6D9CC] bg-[#FBF7F2] p-4 sm:ml-8">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E9DED2] text-[#765B45]">
                                <FiMessageCircle className="text-xs" />
                              </div>

                              <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-[#634936]">
                                Response from our team
                              </p>
                            </div>

                            <p className="font-beautify mt-2 text-xs leading-5 text-[#75685E]">
                              {replyText}
                            </p>

                            {adminReply?.signature && (
                              <p className="font-beautify mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#634936]">
                                — {adminReply.signature}
                              </p>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-8 overflow-hidden rounded-[24px] border border-[#E5D9CE] bg-[#FBF7F2]">
              <div className="relative px-6 py-12 text-center sm:px-10 sm:py-16">
                <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#E7D8C8]/40 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#DCC8B3]/30 blur-3xl" />

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#E0D2C4] bg-white shadow-[0_8px_25px_rgba(73,51,35,0.06)]">
                  <FiMessageCircle className="text-2xl text-[#9A795B]" />
                </div>

                <p className="font-manrope mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A795B]">
                  Customer Experience
                </p>

                <h3 className="mt-2 font-serif text-[27px] font-medium tracking-[-0.03em] text-[#30231B] sm:text-[32px]">
                  No customer reviews yet
                </h3>

                <p className="font-beautify mx-auto mt-3 max-w-[500px] text-sm leading-6 text-[#806F62]">
                  Reviews will appear here after customers receive their orders
                  and share their experience.
                </p>

                <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-[#E2D5C8] bg-white px-4 py-2">
                  <FiShield className="text-sm text-[#9A795B]" />

                  <span className="font-beautify text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8D7B6D]">
                    Verified customer reviews
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mt-16 sm:mt-20">
          <RelatedProducts
            seating={
              productData.attributes?.seating || productData.seating || ""
            }
            material={productData.material}
            productId={productId}
          />
        </section>
      </div>

      {showReviewModal && deliveredOrder && (
        <Review
          order={deliveredOrder}
          item={
            deliveredOrder.items?.find((item) => {
              const itemProductId =
                item?.productId || item?.product || item?._id || item?.id;

              return String(itemProductId) === String(productId);
            }) || {
              name: productData.name,
              image: productData.image,
              quantity: 1,
            }
          }
          productId={productId}
          token={token}
          onClose={handleCloseReview}
          onSuccess={handleReviewSuccess}
        />
      )}
    </main>
  );
};

export default Product;
