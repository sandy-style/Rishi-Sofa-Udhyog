import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import { FiStar, FiUser, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { ShopContext } from "../context/shopContext";

const Review = ({ product, setShowLogin }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { token } = useContext(ShopContext);
  const reviews = product?.reviews || [];

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    return total / reviews.length;
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((review) => Number(review.rating) === star).length,
    }));
  }, [reviews]);

  const percentage = (count) => {
    if (!reviews.length) return 0;
    return Math.round((count / reviews.length) * 100);
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setShowLogin?.(true);
      return;
    }

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (comment.trim().length < 5) {
      toast.error("Review must contain at least 5 characters");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        backendUrl + "/api/admin/review",
        {
          productId: product._id,
          rating,
          comment: comment.trim(),
          name: "Customer",
        },
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        toast.success("Review added successfully");
        setRating(0);
        setHoverRating(0);
        setComment("");
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 border-t border-[#E8DED3] pt-10  sm:pt-14">
      <div className="mb-8 text-center sm:mb-10">
        <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.25em] text-[#9A795B] sm:text-xs">
          Customer Experience
        </p>

        <h2 className="mt-2 font-serif text-[30px] font-medium tracking-[-0.035em] text-[#2F241D] sm:text-[38px]">
          What Our Customers Say
        </h2>

        <p className="font-beautify mx-auto mt-3 max-w-xl text-sm leading-6 text-[#7E746D]">
          Real experiences from customers who have brought our furniture into
          their homes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[22px] border border-[#E4D8CC] bg-[#FBF8F4] p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <span className="font-serif text-5xl font-medium tracking-tight text-[#3B2B20] sm:text-6xl">
              {averageRating ? averageRating.toFixed(1) : "0.0"}
            </span>

            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-[#C99658] text-[#C99658]"
                      : "text-[#D8C9B8]"
                  }`}
                />
              ))}
            </div>

            <p className="font-beautify mt-3 text-sm text-[#806F62]">
              {reviews.length}{" "}
              {reviews.length === 1 ? "customer review" : "customer reviews"}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="font-manrope w-8 text-xs font-semibold text-[#634936]">
                  {star} ★
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E9DED2]">
                  <div
                    className="h-full rounded-full bg-[#C99658] transition-all duration-500"
                    style={{ width: `${percentage(count)}%` }}
                  />
                </div>

                <span className="font-beautify w-8 text-right text-xs text-[#8A7A6D]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E4D8CC] bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A795B]">
                Share your experience
              </p>

              <h3 className="mt-1 font-serif text-2xl text-[#30231B] sm:text-3xl">
                Leave a Review
              </h3>
            </div>

            <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#F3EAE0] text-[#765B45] sm:flex">
              <FiStar className="text-lg" />
            </div>
          </div>

          {!token ? (
            <div className="mt-7 rounded-xl border border-[#E6DCD1] bg-[#FCFAF7] p-5 text-center">
              <p className="font-beautify text-sm text-[#75685E]">
                Please log in to share your experience with this product.
              </p>

              <button
                type="button"
                onClick={() => setShowLogin?.(true)}
                className="mt-4 rounded-lg bg-[#634936] px-6 py-3 font-manrope text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#4D3829]"
              >
                Log In to Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7">
              <div>
                <p className="font-manrope text-xs font-bold uppercase tracking-[0.12em] text-[#634936]">
                  Your Rating
                </p>

                <div className="mt-3 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} star`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="rounded-full p-1 transition-transform duration-200 hover:scale-110"
                    >
                      <FiStar
                        className={`h-7 w-7 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-[#C99658] text-[#C99658]"
                            : "text-[#D5C6B7]"
                        }`}
                      />
                    </button>
                  ))}

                  {rating > 0 && (
                    <span className="font-beautify ml-2 text-sm text-[#806F62]">
                      {rating}/5
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="review-comment"
                  className="font-manrope text-xs font-bold uppercase tracking-[0.12em] text-[#634936]"
                >
                  Your Review
                </label>

                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  rows={5}
                  placeholder="Tell us about your experience with this product..."
                  className="font-beautify mt-3 w-full resize-none rounded-xl border border-[#DDD0C3] bg-[#FCFAF7] px-4 py-3 text-sm text-[#30231B] outline-none transition placeholder:text-[#A99A8C] focus:border-[#A9825E] focus:ring-2 focus:ring-[#A9825E]/10"
                />

                <div className="mt-2 flex justify-end">
                  <span className="font-beautify text-[11px] text-[#A18C79]">
                    {comment.length}/500
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-[#634936] px-6 py-3.5 font-manrope text-xs font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#4D3829] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSend
                  className={`text-base transition-transform duration-300 ${
                    submitting
                      ? ""
                      : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  }`}
                />

                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mt-10">
        {reviews.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#DCCFC1] bg-[#FCFAF7] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E8DE] text-[#765B45]">
              <FiUser className="text-xl" />
            </div>

            <h3 className="mt-4 font-serif text-xl text-[#30231B]">
              No reviews yet
            </h3>

            <p className="font-beautify mt-2 text-sm text-[#8A7A6D]">
              Be the first customer to share your experience.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-[20px] border border-[#E7DDD3] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_12px_35px_rgba(73,51,35,0.07)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE5DA] font-serif text-lg text-[#634936]">
                      {review.name?.charAt(0)?.toUpperCase() || "C"}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-manrope text-sm font-bold text-[#3B2B20]">
                        {review.name || "Customer"}
                      </h4>

                      <p className="font-beautify mt-0.5 text-xs text-[#A18C79]">
                        {formatDate(review.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          star <= Number(review.rating)
                            ? "fill-[#C99658] text-[#C99658]"
                            : "text-[#D8C9B8]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="font-beautify mt-4 text-sm leading-6 text-[#655A52]">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Review;
