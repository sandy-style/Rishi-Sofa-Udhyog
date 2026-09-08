import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const { orderId } = useParams();

  const [orders, setOrders] = useState([]);

  const [pendingCount, setPendingCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [outForDelieveryCount, setOutForDelieveryCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [delieveredCount, setDelieveredCount] = useState(0);

  const [activeFilter, setActiveFilter] = useState("All");
  const [showCustomerInfo, setShowCustomerInfo] = useState(null);

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        let fetchedOrders = response.data.orders;

        // If orderId exists in URL, show only that order
        if (orderId) {
          fetchedOrders = fetchedOrders.filter(
            (order) => order._id === orderId,
          );
        }

        // ==========================================
        // SORT ORDERS
        // ==========================================

        const sortedOrders = [...fetchedOrders].sort((a, b) => {
          // Pending orders first
          if (a.status === "Order Placed" && b.status !== "Order Placed") {
            return -1;
          }

          if (a.status !== "Order Placed" && b.status === "Order Placed") {
            return 1;
          }

          // Older pending orders first
          if (a.status === "Order Placed" && b.status === "Order Placed") {
            return new Date(a.date) - new Date(b.date);
          }

          // Newest non-pending orders first
          return new Date(b.date) - new Date(a.date);
        });

        // ==========================================
        // COUNTS
        // ==========================================

        setPendingCount(
          sortedOrders.filter((item) => item.status === "Order Placed").length,
        );

        setProcessingCount(
          sortedOrders.filter((item) => item.status === "Processing").length,
        );

        setOutForDelieveryCount(
          sortedOrders.filter((item) => item.status === "Out for Delievery")
            .length,
        );

        setDelieveredCount(
          sortedOrders.filter((item) => item.status === "Delivered").length,
        );

        setCancelledCount(
          sortedOrders.filter((item) => item.status === "Cancelled").length,
        );

        setOrders(sortedOrders);

        // Specific order should always show
        if (orderId) {
          setActiveFilter("All");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const orderStatusHandler = async (e, orderId) => {
    try {
      const status = e.target.value;

      const response = await axios.post(
        backendUrl + "/api/order/status",
        {
          orderId,
          status,
        },
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    fetchAllOrders();
    console.log(orderId);
  }, [token, orderId]);

  // ==========================================
  // FILTER ORDERS
  // ==========================================

  /*
    All Orders:
    - Order Placed       ✅
    - Processing         ✅
    - Shipped            ✅
    - Out for Delivery   ✅
    - Delivered          ❌
    - Cancelled          ❌

    Delivered and Cancelled orders are NOT deleted.
    They are simply hidden from the All Orders filter.
  */

  const filteredOrders =
    activeFilter === "All"
      ? orders.filter(
          (order) =>
            order.status !== "Delivered" && order.status !== "Cancelled",
        )
      : orders.filter((order) => order.status === activeFilter);

  // ==========================================
  // ALL ACTIVE ORDERS COUNT
  // ==========================================

  const activeOrdersCount = orders.filter(
    (order) => order.status !== "Delivered" && order.status !== "Cancelled",
  ).length;

  // ==========================================
  // STATUS COLORS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border border-green-200";

      case "Processing":
        return "bg-blue-50 text-blue-700 border border-blue-200";

      case "Shipped":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";

      case "Out for Delievery":
        return "bg-orange-50 text-orange-700 border border-orange-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border border-red-200";

      case "Order Placed":
        return "bg-red-50 text-red-600 border border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // ==========================================
  // FILTER CARD
  // ==========================================

  const FilterCard = ({ title, count, filter, icon }) => {
    const active = activeFilter === filter;

    return (
      <button
        onClick={() => setActiveFilter(filter)}
        className={`
          group
          relative
          overflow-hidden
          rounded-xl
          border
          p-4
          text-left
          transition-all
          duration-200
          sm:p-5
          ${
            active
              ? "border-red-600 bg-red-600 text-white shadow-md"
              : "border-gray-200 bg-white text-gray-800 hover:border-red-300 hover:shadow-sm"
          }
        `}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                active ? "text-red-100" : "text-gray-400"
              }`}
            >
              {title}
            </p>

            <p className="mt-2 text-2xl font-semibold">{count}</p>
          </div>

          <span
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              text-lg
              ${active ? "bg-white/15 text-white" : "bg-red-50 text-red-600"}
            `}
          >
            {icon}
          </span>
        </div>
      </button>
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen w-full bg-gray-50 px-3 py-5 sm:px-5 sm:py-8 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="mb-7 sm:mb-9">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1 w-6 rounded-full bg-red-600" />

            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
              Store Management
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {orderId ? "Order Details" : "Orders"}
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
                {orderId
                  ? "View and manage this customer order."
                  : "Manage deliveries, customers and order information from one place."}
              </p>
            </div>

            {!orderId && (
              <div className="w-fit rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-500 shadow-sm">
                <span className="font-bold text-gray-900">
                  {activeOrdersCount}
                </span>{" "}
                active orders
              </div>
            )}
          </div>

          {/* ==========================================
              FILTERS
          ========================================== */}

          {!orderId && (
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <FilterCard
                title="Pending"
                count={pendingCount}
                filter="Order Placed"
                icon="◷"
              />

              <FilterCard
                title="Processing"
                count={processingCount}
                filter="Processing"
                icon="◌"
              />

              <FilterCard
                title="Delivery"
                count={outForDelieveryCount}
                filter="Out for Delievery"
                icon="→"
              />

              <FilterCard
                title="Delivered"
                count={delieveredCount}
                filter="Delivered"
                icon="✓"
              />

              <FilterCard
                title="Cancelled"
                count={cancelledCount}
                filter="Cancelled"
                icon="×"
              />

              <FilterCard
                title="All Orders"
                count={activeOrdersCount}
                filter="All"
                icon="▦"
              />
            </div>
          )}
        </div>

        {/* ==========================================
            CURRENT FILTER
        ========================================== */}

        {activeFilter !== "All" && !orderId && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {activeFilter === "Out for Delievery"
                  ? "Out for Delivery"
                  : activeFilter}
              </span>{" "}
              orders
            </p>

            <button
              onClick={() => setActiveFilter("All")}
              className="
                self-start
                rounded-lg
                border
                border-gray-200
                px-3
                py-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-500
                transition
                hover:border-red-200
                hover:bg-red-50
                hover:text-red-600
                sm:self-auto
                sm:text-xs
              "
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* ==========================================
            ORDER LIST
        ========================================== */}

        <div className="space-y-5 sm:space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  shadow-sm
                  transition
                  duration-200
                  hover:shadow-md
                "
              >
                {/* ==========================================
                    ORDER HEADER
                ========================================== */}

                <div className="border-b border-gray-100 bg-white px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* ORDER INFO */}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="rounded-md bg-red-600 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
                          ORDER
                        </span>

                        <h2 className="break-all text-xs font-semibold text-gray-900 sm:text-sm">
                          #{order._id}
                        </h2>

                        <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />

                        <p className="text-[10px] text-gray-400 sm:text-xs">
                          {order.date}
                        </p>
                      </div>

                      <p className="mt-3 text-[10px] text-gray-400 sm:text-xs">
                        Customer:{" "}
                        <span className="font-medium text-gray-700">
                          {order.address.firstName} {order.address.lastName}
                        </span>
                      </p>
                    </div>

                    {/* PAYMENT + STATUS */}

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <div className="flex flex-wrap gap-2">
                        {/* PAYMENT */}

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1.5
                            text-[10px]
                            font-semibold
                            sm:text-xs
                            ${
                              order.payment
                                ? "border border-green-200 bg-green-50 text-green-700"
                                : "border border-orange-200 bg-orange-50 text-orange-700"
                            }
                          `}
                        >
                          {order.payment ? "Payment Paid" : "Payment Pending"}
                        </span>

                        {/* STATUS */}

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1.5
                            text-[10px]
                            font-semibold
                            sm:text-xs
                            ${getStatusClass(order.status)}
                          `}
                        >
                          {order.status === "Out for Delievery"
                            ? "Out for Delivery"
                            : order.status}
                        </span>
                      </div>

                      {/* STATUS SELECT */}

                      <select
                        onChange={(e) => orderStatusHandler(e, order._id)}
                        defaultValue={order.status}
                        className="
                          w-full
                          cursor-pointer
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          px-3
                          py-2.5
                          text-xs
                          font-medium
                          text-gray-700
                          outline-none
                          transition
                          focus:border-red-500
                          focus:ring-2
                          focus:ring-red-100
                          sm:w-auto
                        "
                      >
                        <option value="Order Placed">Order Placed</option>

                        <option value="Processing">Processing</option>

                        <option value="Shipped">Shipped</option>

                        <option value="Out for Delievery">
                          Out for Delivery
                        </option>

                        <option value="Delivered">Delivered</option>

                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ==========================================
                    CUSTOMER INFO BUTTON
                ========================================== */}

                <div className="border-b border-gray-100 px-4 py-3 sm:px-6">
                  <button
                    onClick={() =>
                      setShowCustomerInfo(
                        showCustomerInfo === order._id ? null : order._id,
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      py-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-red-600
                      transition
                      hover:text-red-700
                      sm:text-xs
                    "
                  >
                    <span
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                        text-sm
                        font-semibold
                        text-red-600
                      "
                    >
                      {showCustomerInfo === order._id ? "−" : "+"}
                    </span>

                    {showCustomerInfo === order._id
                      ? "Hide Customer Info"
                      : "Show Customer Info"}
                  </button>
                </div>

                {/* ==========================================
                    CUSTOMER INFORMATION
                ========================================== */}

                {showCustomerInfo === order._id && (
                  <div className="grid border-b border-gray-100 bg-gray-50 lg:grid-cols-2">
                    {/* CUSTOMER */}

                    <div className="border-b border-gray-200 p-4 sm:p-6 lg:border-b-0 lg:border-r">
                      <p className="mb-5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                        Customer Information
                      </p>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400">
                            Name
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {order.address.firstName} {order.address.lastName}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400">
                            Email
                          </p>

                          <p className="mt-1 break-all text-sm text-gray-600">
                            {order.address.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400">
                            Phone
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            {order.address.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DELIVERY ADDRESS */}

                    <div className="p-4 sm:p-6">
                      <p className="mb-5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                        Delivery Address
                      </p>

                      <div className="space-y-1 text-sm leading-relaxed text-gray-600">
                        <p className="font-semibold text-gray-900">
                          {order.address.firstName}
                        </p>

                        <p>{order.address.street}</p>

                        <p>
                          {order.address.city}, {order.address.province}
                        </p>

                        <p>{order.address.country}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==========================================
                    ORDERED PRODUCTS
                ========================================== */}

                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Ordered Products
                    </p>

                    <span className="text-[10px] text-gray-400">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="
                          flex
                          flex-col
                          gap-4
                          px-4
                          py-5
                          sm:flex-row
                          sm:items-center
                          sm:px-6
                          sm:py-5
                        "
                      >
                        {/* IMAGE */}

                        <div className="relative h-28 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-24">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          />
                        </div>

                        {/* PRODUCT INFO */}

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {item.name}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                            <span>
                              Color:{" "}
                              <span className="font-medium text-gray-700">
                                {item.color}
                              </span>
                            </span>

                            <span>
                              Quantity:{" "}
                              <span className="font-medium text-gray-700">
                                {item.quantity}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* PRICE */}

                        <div className="rounded-lg bg-gray-50 px-4 py-3 sm:min-w-[140px] sm:text-right">
                          <p className="text-base font-bold text-gray-900">
                            Rs. {item.price.toLocaleString()}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            {item.quantity} × Rs. {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ==========================================
                    ORDER FOOTER
                ========================================== */}

                <div className="grid border-t border-gray-200 bg-gray-900 text-white sm:grid-cols-2">
                  {/* PAYMENT */}

                  <div className="border-b border-gray-800 px-4 py-5 sm:border-b-0 sm:border-r sm:px-6">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Payment Method
                    </p>

                    <p className="mt-2 text-sm font-medium text-white">
                      {order.paymentMethod}
                    </p>
                  </div>

                  {/* TOTAL */}

                  <div className="px-4 py-5 sm:px-6 sm:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Order Total
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                      Rs. {order.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* ==========================================
               EMPTY STATE
            ========================================== */

            <div className="rounded-xl border border-gray-200 bg-white px-4 py-16 text-center shadow-sm sm:px-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-red-50 text-2xl text-red-500">
                ▦
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                No Orders Found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-gray-500 sm:text-sm">
                {orderId
                  ? "The requested order could not be found."
                  : activeFilter === "All"
                    ? "There are no active orders. Delivered and cancelled orders are hidden from All Orders."
                    : "There are no orders matching the selected status."}
              </p>

              {activeFilter !== "All" && !orderId && (
                <button
                  onClick={() => setActiveFilter("All")}
                  className="
                    mt-5
                    rounded-lg
                    bg-red-600
                    px-5
                    py-2.5
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:bg-red-700
                  "
                >
                  View All Orders
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
