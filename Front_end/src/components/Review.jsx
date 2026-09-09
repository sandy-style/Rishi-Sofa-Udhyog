import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiStar, FiX, FiSend, FiEdit3, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Review = ({ order, item, productId, token, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [existingReview, setExistingReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // LOAD EXISTING REVIEW
  // ==========================================

  useEffect(() => {
    const loadExistingReview = async () => {
      if (!productId || !token) {
        setExistingReview(null);
        setRating(0);
        setComment("");
        setLoadingReview(false);
        return;
      }

      try {
        setLoadingReview(true);

        const response = await axios.post(
          backendUrl + "/api/admin/review/myreview",
          {
            productId,
          },
          {
            headers: {
              token,
            },
          },
        );

        if (response.data.success && response.data.review) {
          const review = response.data.review;

          setExistingReview(review);
          setRating(Number(review.rating) || 0);
          setComment(review.comment || "");
        } else {
          setExistingReview(null);
          setRating(0);
          setComment("");
        }
      } catch (error) {
        console.error("Load review error:", error);

        setExistingReview(null);
        setRating(0);
        setComment("");
      } finally {
        setLoadingReview(false);
      }
    };

    loadExistingReview();
  }, [productId, token]);

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose?.();
    }
  };

  // ==========================================
  // SUBMIT / UPDATE REVIEW
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please log in to review");
      return;
    }

    if (!productId) {
      toast.error("Product information is missing");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      toast.error("Please write a review");
      return;
    }

    if (trimmedComment.length < 5) {
      toast.error("Review must contain at least 5 characters");
      return;
    }

    try {
      setSubmitting(true);

      let response;

      // ==========================================
      // EDIT EXISTING REVIEW
      // ==========================================

      if (existingReview?._id) {
        response = await axios.put(
          backendUrl + "/api/admin/review/edit",
          {
            productId,
            rating: Number(rating),
            comment: trimmedComment,
          },
          {
            headers: {
              token,
            },
          },
        );
      }

      // ==========================================
      // ADD NEW REVIEW
      // ==========================================
      else {
        response = await axios.post(
          backendUrl + "/api/admin/review",
          {
            productId,
            rating: Number(rating),
            comment: trimmedComment,
          },
          {
            headers: {
              token,
            },
          },
        );
      }

      if (response.data.success) {
        toast.success(
          existingReview
            ? "Review updated successfully"
            : "Review added successfully",
        );

        onSuccess?.();
      } else {
        toast.error(
          response.data.message ||
            (existingReview
              ? "Unable to update review"
              : "Unable to submit review"),
        );
      }
    } catch (error) {
      console.error("Review submit error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to save review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================

  const productImage =
    Array.isArray(item?.image) && item.image.length > 0
      ? item.image[0]
      : item?.image;

  // ==========================================
  // LOADING
  // ==========================================

  if (loadingReview) {
    return (
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#241A14]/50 px-4 backdrop-blur-[3px]"
      >
        <div className="w-full max-w-md rounded-[24px] border border-[#E4D8CC] bg-[#FCFAF7] p-8 text-center shadow-[0_25px_80px_rgba(45,30,20,0.25)]">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#DCCFC1] border-t-[#634936]" />

          <p className="font-beautify mt-4 text-sm text-[#806F62]">
            Loading your review...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#241A14]/50 px-4 py-6 backdrop-blur-[3px] sm:px-6"
    >
      {/* ==========================================
          MODAL
      ========================================== */}

      <div className="relative my-auto w-full max-w-[520px] overflow-hidden rounded-[26px] border border-[#E3D6C9] bg-[#FCFAF7] shadow-[0_25px_80px_rgba(45,30,20,0.28)]">
        {/* ==========================================
            CLOSE BUTTON
        ========================================== */}

        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close review"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#E2D5C8] bg-white text-[#765B45] transition hover:bg-[#F3EAE0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiX className="text-lg" />
        </button>

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="border-b border-[#E8DED3] px-6 pb-5 pt-7 sm:px-8">
          <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.22em] text-[#9A795B]">
            Customer Experience
          </p>

          <h2 className="mt-1 pr-10 font-serif text-[27px] font-medium tracking-[-0.03em] text-[#30231B] sm:text-[30px]">
            {existingReview ? "Edit Your Review" : "Write a Review"}
          </h2>

          <p className="font-beautify mt-2 text-sm leading-5 text-[#806F62]">
            {existingReview
              ? "Update your experience with this product."
              : "Tell us what you think about this product."}
          </p>
        </div>

        {/* ==========================================
            PRODUCT
        ========================================== */}

        <div className="px-6 pt-5 sm:px-8">
          <div className="flex items-center gap-4 rounded-[17px] border border-[#E5D9CE] bg-white p-3">
            {productImage ? (
              <img
                src={productImage}
                alt={item?.name || "Product"}
                className="h-[68px] w-[68px] shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-xl bg-[#F1E8DE] text-[#765B45]">
                <FiStar className="text-xl" />
              </div>
            )}

            <div className="min-w-0">
              <h3 className="truncate font-manrope text-sm font-bold text-[#3B2B20]">
                {item?.name || "Product"}
              </h3>

              <p className="font-beautify mt-1 text-xs text-[#9A897B]">
                Quantity: {item?.quantity || 1}
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8"
        >
          {/* ==========================================
              RATING
          ========================================== */}

          <div>
            <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.13em] text-[#634936]">
              Your Rating
            </p>

            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const activeStar = star <= (hoverRating || rating);

                return (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} star`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    disabled={submitting}
                    className="rounded-full p-1.5 transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
                  >
                    <FiStar
                      className={`h-8 w-8 transition-all duration-200 ${
                        activeStar
                          ? "fill-[#C99658] text-[#C99658]"
                          : "text-[#D6C7B8]"
                      }`}
                    />
                  </button>
                );
              })}

              {rating > 0 && (
                <span className="font-beautify ml-2 text-sm text-[#806F62]">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          {/* ==========================================
              COMMENT
          ========================================== */}

          <div className="mt-6">
            <label
              htmlFor="review-comment"
              className="font-manrope text-[11px] font-bold uppercase tracking-[0.13em] text-[#634936]"
            >
              Your Review
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={5}
              disabled={submitting}
              placeholder="Tell us about your experience with this product..."
              className="font-beautify mt-3 w-full resize-none rounded-[15px] border border-[#DDD0C3] bg-white px-4 py-3.5 text-sm leading-6 text-[#30231B] outline-none transition placeholder:text-[#AA9A8B] focus:border-[#A9825E] focus:ring-2 focus:ring-[#A9825E]/10 disabled:cursor-not-allowed disabled:opacity-70"
            />

            <div className="mt-2 flex justify-end">
              <span className="font-beautify text-[11px] text-[#A18C79]">
                {comment.length}/500
              </span>
            </div>
          </div>

          {/* ==========================================
              BUTTONS
          ========================================== */}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-xl border border-[#DCCFC1] bg-white px-5 py-3.5 font-manrope text-xs font-bold uppercase tracking-[0.08em] text-[#634936] transition hover:bg-[#F5EEE7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="group flex flex-1 items-center justify-center gap-2.5 rounded-xl bg-[#634936] px-5 py-3.5 font-manrope text-xs font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#4D3829] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {existingReview ? (
                <FiEdit3 className="text-base" />
              ) : (
                <FiSend className="text-base transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}

              {submitting
                ? existingReview
                  ? "Updating..."
                  : "Submitting..."
                : existingReview
                  ? "Update Review"
                  : "Submit Review"}
            </button>
          </div>

          {/* ==========================================
              EDIT INDICATOR
          ========================================== */}

          {existingReview && !submitting && (
            <div className="mt-4 flex items-center justify-center gap-2 text-center">
              <FiCheck className="text-sm text-[#8A6A4E]" />

              <p className="font-beautify text-xs text-[#8A7A6D]">
                You are editing your existing review
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Review;
