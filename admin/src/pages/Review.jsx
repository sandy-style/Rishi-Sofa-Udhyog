import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiStar, FiUser, FiMessageCircle, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import Reply from "../components/Reply";

const Review = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH PRODUCTS + REVIEWS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(backendUrl + "/api/admin/listproducts", {
        headers: {
          token,
        },
      });

      if (response.data.success) {
        setProducts(response.data.products || []);

        console.log("Admin review products:", response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Fetch reviews error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load reviews",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH ON LOAD
  // ==========================================

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  // ==========================================
  // CREATE FLAT REVIEW LIST
  // ==========================================

  const allReviews = useMemo(() => {
    const reviews = [];

    products.forEach((product) => {
      if (!product.reviews || !Array.isArray(product.reviews)) {
        return;
      }

      product.reviews.forEach((review) => {
        reviews.push({
          ...review,
          productId: product._id,
          productName: product.name,
          productImage: product.image?.[0] || "",
          productCategory: product.category || "",
          product,
        });
      });
    });

    // Latest reviews first
    reviews.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0).getTime();

      const dateB = new Date(b.date || b.createdAt || 0).getTime();

      return dateB - dateA;
    });

    return reviews;
  }, [products]);

  // ==========================================
  // PENDING + REPLIED REVIEWS
  // ==========================================

  const pendingReviews = useMemo(() => {
    return allReviews.filter((review) => {
      return !review.adminReply;
    });
  }, [allReviews]);

  const repliedReviews = useMemo(() => {
    return allReviews.filter((review) => {
      return !!review.adminReply;
    });
  }, [allReviews]);

  // ==========================================
  // REVIEW STATISTICS
  // ==========================================

  const averageRating = useMemo(() => {
    if (!allReviews.length) {
      return 0;
    }

    const total = allReviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    return total / allReviews.length;
  }, [allReviews]);

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: allReviews.filter((review) => Number(review.rating) === star)
        .length,
    }));
  }, [allReviews]);

  const percentage = (count) => {
    if (!allReviews.length) {
      return 0;
    }

    return Math.round((count / allReviews.length) * 100);
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // ==========================================
  // REFRESH AFTER REPLY
  // ==========================================

  const handleRefresh = async () => {
    await fetchProducts();
  };

  // ==========================================
  // REVIEW CARD
  // ==========================================

  const ReviewCard = ({ review, replied = false }) => {
    return (
      <article
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          transition
          hover:shadow-md
        "
      >
        {/* ==========================================
            PRODUCT HEADER
        ========================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-gray-200
            bg-gray-50
            p-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:p-5
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* PRODUCT IMAGE */}

            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-200">
              {review.productImage ? (
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <FiMessageCircle />
                </div>
              )}
            </div>

            {/* PRODUCT INFO */}

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Product Review
              </p>

              <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                {review.productName || "Product"}
              </h2>

              {review.productCategory && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {review.productCategory}
                </p>
              )}
            </div>
          </div>

          {/* STATUS + DATE */}

          <div className="flex shrink-0 items-center gap-3">
            {replied && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-green-50
                  px-3
                  py-1.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-green-700
                "
              >
                <FiCheckCircle className="text-xs" />
                Replied
              </span>
            )}

            <p className="text-xs text-gray-400">
              {formatDate(review.date || review.createdAt)}
            </p>
          </div>
        </div>

        {/* ==========================================
            REVIEW CONTENT
        ========================================== */}

        <div className="p-5 sm:p-6">
          {/* CUSTOMER HEADER */}

          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {/* AVATAR */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  font-serif
                  text-lg
                  font-semibold
                  text-gray-700
                "
              >
                {review.name?.charAt(0)?.toUpperCase() || "C"}
              </div>

              {/* NAME */}

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-gray-900">
                  {review.name || "Customer"}
                </h3>

                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Number(review.rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}

                  <span className="ml-1 text-xs font-medium text-gray-500">
                    {Number(review.rating || 0)}/5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COMMENT */}

          <div
            className="
              mt-5
              rounded-xl
              border
              border-gray-100
              bg-gray-50
              p-4
            "
          >
            <p className="text-sm leading-6 text-gray-700">{review.comment}</p>
          </div>

          {/* ==========================================
              ADMIN REPLY
          ========================================== */}

          {replied ? (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />

                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Admin Reply
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-green-100
                  bg-green-50
                  p-4
                "
              >
                <p className="text-sm leading-6 text-gray-700">
                  {review.adminReply?.message ||
                    review.adminReply?.comment ||
                    review.adminReply?.text ||
                    review.adminReply?.reply ||
                    "Reply submitted."}
                </p>

                {review.adminReply?.date && (
                  <p className="mt-2 text-[10px] text-gray-400">
                    Replied on {formatDate(review.adminReply.date)}
                  </p>
                )}
              </div>

              {/* ALLOW ADMIN TO EDIT/REPLY AGAIN */}

              <div className="mt-5">
                <Reply
                  review={review}
                  product={review.product}
                  token={token}
                  onReplySuccess={fetchProducts}
                />
              </div>
            </div>
          ) : (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <FiMessageCircle className="text-gray-500" />

                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Reply to Customer
                </p>
              </div>

              <Reply
                review={review}
                product={review.product}
                token={token}
                onReplySuccess={fetchProducts}
              />
            </div>
          )}
        </div>
      </article>
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="w-full bg-gray-50 p-3 sm:p-5 md:p-8">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-6 sm:mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 sm:text-xs">
          Customer Feedback
        </p>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Customer Reviews
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View customer reviews and reply to their feedback.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:bg-gray-100
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            {loading ? "Refreshing..." : "Refresh Reviews"}
          </button>
        </div>
      </div>

      {/* ==========================================
          STATISTICS
      ========================================== */}

      {!loading && (
        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
            sm:gap-5
          "
        >
          {/* TOTAL REVIEWS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Reviews
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {allReviews.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                <FiMessageCircle className="text-lg" />
              </div>
            </div>
          </div>

          {/* AVERAGE RATING */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Average Rating
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {averageRating ? averageRating.toFixed(1) : "0.0"}
                  </p>

                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(averageRating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
                <FiStar className="text-lg" />
              </div>
            </div>
          </div>

          {/* PRODUCTS REVIEWED */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Products Reviewed
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {new Set(allReviews.map((review) => review.productId)).size}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                <FiUser className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          RATING SUMMARY
      ========================================== */}

      {!loading && allReviews.length > 0 && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
            {/* AVERAGE */}

            <div className="text-center md:border-r md:border-gray-200 md:pr-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Overall Rating
              </p>

              <p className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
                {averageRating.toFixed(1)}
              </p>

              <div className="mt-2 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Based on {allReviews.length}{" "}
                {allReviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* RATING BARS */}

            <div className="space-y-3">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-8 text-xs font-semibold text-gray-600">
                    {star} ★
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-900 transition-all duration-500"
                      style={{
                        width: `${percentage(count)}%`,
                      }}
                    />
                  </div>

                  <span className="w-8 text-right text-xs text-gray-500">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          LOADING
      ========================================== */}

      {loading && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                animate-pulse
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
              "
            >
              <div className="h-24 bg-gray-200" />

              <div className="space-y-4 p-5">
                <div className="h-4 w-1/3 rounded bg-gray-200" />

                <div className="h-4 w-full rounded bg-gray-200" />

                <div className="h-4 w-4/5 rounded bg-gray-200" />

                <div className="h-10 w-full rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================
          NO REVIEWS
      ========================================== */}

      {!loading && allReviews.length === 0 && (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-gray-300
            bg-white
            px-6
            py-16
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-500
            "
          >
            <FiMessageCircle className="text-2xl" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            No customer reviews yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            When customers submit reviews for your products, they will appear
            here and you will be able to reply to them.
          </p>
        </div>
      )}

      {/* ==========================================
          PENDING REVIEWS
      ========================================== */}

      {!loading && pendingReviews.length > 0 && (
        <section className="mb-10">
          {/* SECTION HEADER */}

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Pending Reviews
                </h2>

                <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-[10px] font-bold text-yellow-700">
                  {pendingReviews.length}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                These reviews are waiting for an admin reply.
              </p>
            </div>
          </div>

          {/* PENDING LIST */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {pendingReviews.map((review) => (
              <ReviewCard
                key={`${review.productId}-${review._id}`}
                review={review}
                replied={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* ==========================================
          REPLIED REVIEWS
      ========================================== */}

      {!loading && repliedReviews.length > 0 && (
        <section className="mt-10">
          {/* SECTION HEADER */}

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Replied Reviews
                </h2>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                  {repliedReviews.length}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Reviews that have already received a reply from the admin.
              </p>
            </div>
          </div>

          {/* REPLIED LIST */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {repliedReviews.map((review) => (
              <ReviewCard
                key={`${review.productId}-${review._id}`}
                review={review}
                replied={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* ==========================================
          ALL REVIEWS EXIST BUT NONE PENDING
      ========================================== */}

      {!loading && allReviews.length > 0 && pendingReviews.length === 0 && (
        <div
          className="
              mt-8
              rounded-2xl
              border
              border-green-100
              bg-green-50
              p-5
              text-center
            "
        >
          <div className="flex items-center justify-center gap-2 text-green-700">
            <FiCheckCircle />

            <p className="text-sm font-semibold">
              All customer reviews have been replied to.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
