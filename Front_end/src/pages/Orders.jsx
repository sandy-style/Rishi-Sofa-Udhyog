import React, { useContext, useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiPackage,
  FiShoppingBag,
  FiEdit3,
} from "react-icons/fi";
import { ShopContext } from "../context/shopContext";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import Review from "../components/Review";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getOrderStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-[#EAF5EC] text-[#39734A] border-[#CFE6D4]";

    case "processing":
      return "bg-[#FBF1DF] text-[#9A672E] border-[#EBD7B5]";

    case "shipped":
      return "bg-[#EAF1F8] text-[#426886] border-[#D1DFEC]";

    case "cancelled":
      return "bg-[#FBEAEA] text-[#A64A4A] border-[#EBCFCF]";

    default:
      return "bg-[#F3F0EC] text-[#6F665D] border-[#DDD6CF]";
  }
};

const getOrderStatusDot = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-[#4E9A63]";

    case "processing":
      return "bg-[#C58B50]";

    case "shipped":
      return "bg-[#527B9C]";

    case "cancelled":
      return "bg-[#C65B5B]";

    default:
      return "bg-[#9A9188]";
  }
};

const Orders = () => {
  const { currency, token, navigate } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  // Product/order item selected for review
  const [selectedReview, setSelectedReview] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        setOrderData(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  /*
   * Open review popup
   *
   * We keep the complete order + item information here so the
   * Review component can later use it for adding/editing.
   */
  const openReview = (order, item) => {
    setSelectedReview({
      order,
      item,
      productId: item.productId || item._id || item.id,
    });
  };

  const closeReview = () => {
    setSelectedReview(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] px-3 py-10 font-manrope sm:px-5 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1200px]">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-10 text-center sm:mb-12">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-[#B08A68] sm:w-10" />

            <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.3em] text-[#907B68] sm:text-[10px]">
              Your Account
            </span>

            <span className="h-px w-7 bg-[#B08A68] sm:w-10" />
          </div>

          <h1 className="font-heading text-[38px] font-semibold leading-none tracking-[-0.035em] text-[#29231F] sm:text-[48px]">
            My <span className="text-[#80634B]">Orders</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-[11px] font-medium leading-5 text-[#81766C] sm:text-xs">
            Keep track of your purchases and order details in one place.
          </p>
        </div>

        {/* =====================================================
            ORDER COUNT
        ===================================================== */}

        {orderData.length > 0 && (
          <div className="mb-6 flex items-center justify-between border-b border-[#DED5CC] pb-4">
            <div className="flex items-center gap-2">
              <FiPackage className="text-[#80634B]" size={17} />

              <span className="font-manrope text-xs font-bold uppercase tracking-[0.12em] text-[#51463D] sm:text-sm">
                Order History
              </span>
            </div>

            <span className="rounded-full bg-[#EAE1D7] px-3 py-1 font-manrope text-[10px] font-bold text-[#6C5A4A]">
              {orderData.length} {orderData.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
        )}

        {/* =====================================================
            ORDERS
        ===================================================== */}

        <div className="space-y-5">
          {orderData.map((order) =>
            order.items.map((item, index) => (
              <article
                key={`${order._id}-${index}`}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E1D8CF]
                  bg-[#FCFAF7]
                  shadow-[0_8px_30px_rgba(70,52,37,0.05)]
                  transition-all
                  duration-300
                  hover:border-[#D2C0AE]
                  hover:shadow-[0_15px_40px_rgba(70,52,37,0.09)]
                  sm:rounded-3xl
                "
              >
                <div className="grid grid-cols-1 lg:grid-cols-[210px_1fr_auto]">
                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================= */}

                  <div className="relative h-[230px] overflow-hidden bg-[#EEE8E0] sm:h-[280px] lg:h-full lg:min-h-[220px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.04]
                      "
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/75 text-[#6E5742] shadow-sm backdrop-blur-md">
                      <FiShoppingBag size={15} />
                    </div>
                  </div>

                  {/* =================================================
                      PRODUCT DETAILS
                  ================================================= */}

                  <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-8">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.18em] text-[#A08E7D]">
                        Order
                      </span>

                      <span className="h-1 w-1 rounded-full bg-[#B9A797]" />

                      <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#A08E7D]">
                        #{order._id.slice(0, 7)}
                      </span>
                    </div>

                    <h2 className="font-heading text-[23px] font-semibold leading-tight tracking-[-0.025em] text-[#29231F] sm:text-[27px]">
                      {item.name}
                    </h2>

                    <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 sm:gap-x-8">
                      <div>
                        <p className="font-manrope text-[8px] font-bold uppercase tracking-[0.15em] text-[#A0958B]">
                          Quantity
                        </p>

                        <p className="mt-1 font-manrope text-sm font-bold text-[#51473F]">
                          {item.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="font-manrope text-[8px] font-bold uppercase tracking-[0.15em] text-[#A0958B]">
                          Ordered
                        </p>

                        <p className="mt-1 font-manrope text-sm font-bold text-[#51473F]">
                          {formatDate(order.date)}
                        </p>
                      </div>

                      <div>
                        <p className="font-manrope text-[8px] font-bold uppercase tracking-[0.15em] text-[#A0958B]">
                          Payment
                        </p>

                        <p className="mt-1 font-manrope text-sm font-bold text-[#51473F]">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      PRICE + STATUS + REVIEW
                  ================================================= */}

                  <div className="flex flex-row items-center justify-between gap-5 border-t border-[#E7DFD7] bg-[#F9F6F2] p-5 sm:p-7 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:p-8">
                    <div>
                      <p className="mb-1 font-manrope text-[8px] font-bold uppercase tracking-[0.18em] text-[#A0958B]">
                        Total
                      </p>

                      <p className="font-heading text-xl font-semibold tracking-tight text-[#302721] sm:text-2xl">
                        {currency}
                        {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* =========================
                          ORDER STATUS
                      ========================= */}

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          px-3
                          py-1.5
                          font-manrope
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.08em]
                          ${getOrderStatusStyle(order.status)}
                        `}
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${getOrderStatusDot(order.status)}
                          `}
                        />

                        {order.status}
                      </span>

                      {/* =========================
                          PAYMENT STATUS
                      ========================= */}

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          px-3
                          py-1.5
                          font-manrope
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.08em]
                          ${
                            order.payment
                              ? "border-[#CFE6D4] bg-[#EAF5EC] text-[#39734A]"
                              : "border-[#EBD7B5] bg-[#FBF1DF] text-[#9A672E]"
                          }
                        `}
                      >
                        <span
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${order.payment ? "bg-[#4E9A63]" : "bg-[#C58B50]"}
                          `}
                        />

                        {order.payment ? "Paid" : "Payment Pending"}
                      </span>

                      {/* =========================
                          REVIEW BUTTON

                          Only visible when order is
                          actually Delivered.
                      ========================= */}

                      {order.status === "Delivered" && (
                        <button
                          type="button"
                          onClick={() => openReview(order, item)}
                          className="
                            group/review
                            mt-1
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[#80634B]
                            bg-[#80634B]
                            px-4
                            py-2.5
                            font-manrope
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.1em]
                            text-white
                            shadow-[0_5px_15px_rgba(128,99,75,0.16)]
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:bg-[#6F543E]
                            hover:shadow-[0_8px_20px_rgba(128,99,75,0.22)]
                            active:translate-y-0
                          "
                        >
                          <FiEdit3
                            size={13}
                            className="
                              transition-transform
                              duration-300
                              group-hover/review:rotate-[-8deg]
                            "
                          />
                          Write a Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )),
          )}
        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {orderData.length === 0 && (
          <div className="rounded-3xl border border-[#E1D8CF] bg-[#FCFAF7] px-5 py-20 text-center shadow-[0_10px_35px_rgba(70,52,37,0.04)] sm:py-24">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EEE5DB] text-[#80634B]">
              <FiShoppingBag size={25} />
            </div>

            <h2 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-[#332A24] sm:text-3xl">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm font-manrope text-xs font-medium leading-5 text-[#81766C] sm:text-sm">
              Your order history will appear here once you make your first
              purchase.
            </p>

            <button
              type="button"
              onClick={() => navigate("/collection")}
              className="
                group
                mt-7
                inline-flex
                items-center
                gap-3
                rounded-xl
                bg-[#332A24]
                px-5
                py-3.5
                font-manrope
                text-[10px]
                font-bold
                uppercase
                tracking-[0.1em]
                text-white
                shadow-[0_8px_20px_rgba(51,42,36,0.16)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#80634B]
              "
            >
              Continue Shopping
              <FiArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          REVIEW POPUP
      ===================================================== */}

      {selectedReview && (
        <Review
          order={selectedReview.order}
          item={selectedReview.item}
          productId={selectedReview.productId}
          token={token}
          onClose={closeReview}
          onSuccess={() => {
            closeReview();
            loadOrderData();
          }}
        />
      )}
    </div>
  );
};

export default Orders;
