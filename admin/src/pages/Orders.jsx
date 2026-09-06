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

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        let fetchedOrders = response.data.orders;

        // If there is an orderId in the URL,
        // only keep that specific order
        if (orderId) {
          fetchedOrders = fetchedOrders.filter(
            (order) => order._id === orderId,
          );
        }

        const sortedOrders = [...fetchedOrders].sort((a, b) => {
          // Pending orders come first
          if (a.status === "Order Placed" && b.status !== "Order Placed")
            return -1;

          if (a.status !== "Order Placed" && b.status === "Order Placed")
            return 1;

          // If both are pending, older order comes first
          if (a.status === "Order Placed" && b.status === "Order Placed") {
            return new Date(a.date) - new Date(b.date);
          }

          // For non-pending orders, newest first
          return new Date(b.date) - new Date(a.date);
        });

        // Counts
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

        // When opening a specific order,
        // always show that order regardless of filter
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

  const orderStatusHandler = async (e, orderId) => {
    try {
      const status = e.target.value;

      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status },
        { headers: { token } },
      );

      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    console.log(orderId);
  }, [token, orderId]);

  // FILTER ORDERS
  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <div className="min-h-screen w-full px-3 py-6 sm:px-5 sm:py-8 md:px-8 md:py-10 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* PAGE HEADER */}
        <div className="mb-7 sm:mb-10">
          <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.25em] text-[#9b8f82] sm:text-[10px] sm:tracking-[0.3em]">
            Store Management
          </p>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-normal tracking-tight text-[#292521] sm:text-3xl">
                {orderId ? "Order Details" : "Orders"}
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#857a70] sm:text-sm">
                {orderId
                  ? "View and manage this order."
                  : "Manage deliveries, customers and order information."}
              </p>
            </div>

            {/* FILTERS */}
            {!orderId && (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-x-4
                  gap-y-5
                  border-y
                  border-[#e1dbd3]
                  py-5
                  sm:grid-cols-3
                  sm:gap-x-6
                  sm:gap-y-6
                  md:grid-cols-6
                  md:py-6
                "
              >
                {/* PENDING */}
                <div
                  onClick={() => setActiveFilter("Order Placed")}
                  className={`cursor-pointer text-left transition sm:text-center ${
                    activeFilter === "Order Placed"
                      ? "scale-105 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <p className="text-xl font-medium text-[#292521] sm:text-2xl">
                    {pendingCount}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9b8f82] sm:text-xs">
                    Pending
                  </p>
                </div>

                {/* PROCESSING */}
                <div
                  onClick={() => setActiveFilter("Processing")}
                  className={`cursor-pointer text-left transition sm:text-center ${
                    activeFilter === "Processing"
                      ? "scale-105 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <p className="text-xl font-medium text-[#292521] sm:text-2xl">
                    {processingCount}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9b8f82] sm:text-xs">
                    Processing
                  </p>
                </div>

                {/* OUT FOR DELIVERY */}
                <div
                  onClick={() => setActiveFilter("Out for Delievery")}
                  className={`cursor-pointer text-left transition sm:text-center ${
                    activeFilter === "Out for Delievery"
                      ? "scale-105 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <p className="text-xl font-medium text-[#292521] sm:text-2xl">
                    {outForDelieveryCount}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9b8f82] sm:text-xs">
                    Out for Delivery
                  </p>
                </div>

                {/* DELIVERED */}
                <div
                  onClick={() => setActiveFilter("Delivered")}
                  className={`cursor-pointer text-left transition sm:text-center ${
                    activeFilter === "Delivered"
                      ? "scale-105 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <p className="text-xl font-medium text-[#292521] sm:text-2xl">
                    {delieveredCount}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9b8f82] sm:text-xs">
                    Delivered
                  </p>
                </div>

                {/* CANCELLED */}
                <div
                  onClick={() => setActiveFilter("Cancelled")}
                  className={`cursor-pointer text-left transition sm:text-center ${
                    activeFilter === "Cancelled"
                      ? "scale-105 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <p className="text-xl font-medium text-[#292521] sm:text-2xl">
                    {cancelledCount}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9b8f82] sm:text-xs">
                    Cancelled
                  </p>
                </div>

                {/* TOTAL ORDERS */}
                <div
                  onClick={() => setActiveFilter("All")}
                  className={`cursor-pointer text-left transition sm:text-center ${
                    activeFilter === "All"
                      ? "scale-105 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <p className="text-xl font-medium text-[#292521] sm:text-2xl">
                    {orders.length}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-[#9b8f82] sm:text-xs">
                    Total Orders
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CURRENT FILTER */}
        {activeFilter !== "All" && !orderId && (
          <div className="mb-5 flex flex-col gap-3 border border-[#ddd6cd] bg-[#f9f6f1] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-[#756b61]">
              Showing <span className="font-semibold">{activeFilter}</span>{" "}
              orders
            </p>

            <button
              onClick={() => setActiveFilter("All")}
              className="self-start text-[10px] font-medium uppercase tracking-wider text-[#756b61] hover:text-[#292521] sm:self-auto sm:text-xs"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* ORDER LIST */}
        <div className="space-y-5 sm:space-y-8">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden border border-[#ddd6cd] bg-[#fbfaf8]"
              >
                {/* ORDER HEADER */}
                <div className="border-b border-[#e1dbd3] bg-[#f9f6f1] px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-5">
                    {/* ORDER INFO */}
                    <div className="min-w-0">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                        <h2 className="break-all text-xs font-medium text-[#292521] sm:text-sm">
                          #{order._id}
                        </h2>

                        <span className="hidden h-1 w-1 rounded-full bg-[#b6aa9d] sm:block" />

                        <p className="text-[10px] text-[#8d8379] sm:text-xs">
                          {order.date}
                        </p>
                      </div>

                      <p className="mt-2 text-[10px] text-[#8d8379] sm:text-xs">
                        Customer:{" "}
                        <span className="text-[#4e4740]">
                          {order.address.firstName} {order.address.lastName}
                        </span>
                      </p>
                    </div>

                    {/* PAYMENT + STATUS */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <div className="flex flex-wrap gap-2">
                        {/* PAYMENT */}
                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-medium sm:text-xs ${
                            order.payment
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {order.payment ? "Payment Paid" : "Payment Pending"}
                        </span>

                        {/* ORDER STATUS */}
                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-medium sm:text-xs ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : order.status === "Shipped"
                                ? "bg-blue-50 text-blue-700"
                                : order.status === "Cancelled"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-700"
                          }`}
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
                          border
                          border-[#d5cdc3]
                          bg-white
                          px-3
                          py-2.5
                          text-xs
                          text-[#4e4740]
                          outline-none
                          focus:border-[#9b8f82]
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

                {/* CUSTOMER INFO BUTTON */}
                <div className="border-b border-[#e3ddd5] px-4 py-3 sm:px-6 sm:py-4">
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
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-[#756b61]
                      transition
                      hover:text-[#292521]
                      sm:text-xs
                      sm:tracking-[0.15em]
                    "
                  >
                    <span className="text-base">
                      {showCustomerInfo === order._id ? "−" : "+"}
                    </span>

                    {showCustomerInfo === order._id
                      ? "Hide Customer Info"
                      : "Show Customer Info"}
                  </button>
                </div>

                {/* CUSTOMER INFORMATION */}
                {showCustomerInfo === order._id && (
                  <div className="grid border-b border-[#e3ddd5] bg-[#faf8f5] lg:grid-cols-2">
                    {/* CUSTOMER */}
                    <div className="border-b border-[#e3ddd5] p-4 sm:p-6 lg:border-b-0 lg:border-r">
                      <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#9b8f82] sm:text-[10px] sm:tracking-[0.2em]">
                        Customer Information
                      </p>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-[#aaa095] sm:text-[10px]">
                            Name
                          </p>

                          <p className="mt-1 text-sm font-medium text-[#292521]">
                            {order.address.firstName} {order.address.lastName}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-[#aaa095] sm:text-[10px]">
                            Email
                          </p>

                          <p className="mt-1 break-all text-sm text-[#4e4740]">
                            {order.address.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-[#aaa095] sm:text-[10px]">
                            Phone
                          </p>

                          <p className="mt-1 text-sm text-[#4e4740]">
                            {order.address.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DELIVERY ADDRESS */}
                    <div className="p-4 sm:p-6">
                      <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#9b8f82] sm:text-[10px] sm:tracking-[0.2em]">
                        Delivery Address
                      </p>

                      <div className="space-y-1 text-sm leading-relaxed text-[#4e4740]">
                        <p className="font-medium text-[#292521]">
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

                {/* PRODUCTS */}
                <div>
                  <div className="border-b border-[#e3ddd5] px-4 py-3 sm:px-6 sm:py-4">
                    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#9b8f82] sm:text-[10px] sm:tracking-[0.2em]">
                      Ordered Products
                    </p>
                  </div>

                  <div className="divide-y divide-[#eee9e2]">
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
                          sm:py-6
                        "
                      >
                        {/* IMAGE */}
                        <div className="h-28 w-full flex-shrink-0 overflow-hidden bg-[#eee9e2] sm:h-24 sm:w-24">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* PRODUCT INFO */}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-medium text-[#292521]">
                            {item.name}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#8b8177]">
                            <span>Color: {item.color}</span>

                            <span>Quantity: {item.quantity}</span>
                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="border-t border-[#eee9e2] pt-3 sm:border-0 sm:pt-0 sm:text-right">
                          <p className="text-sm font-medium text-[#292521]">
                            Rs. {item.price.toLocaleString()}
                          </p>

                          <p className="mt-1 text-xs text-[#9b9187]">
                            {item.quantity} × Rs. {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col gap-4 border-t border-[#ddd6cd] bg-[#f8f5f0] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <p className="text-xs text-[#8b8177]">Payment Method</p>

                    <p className="mt-1 text-sm font-medium text-[#4e4740]">
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div className="border-t border-[#e1dbd3] pt-3 sm:border-0 sm:pt-0 sm:text-right">
                    <p className="text-xs text-[#9b9187]">Order Total</p>

                    <p className="mt-1 text-lg font-medium text-[#292521]">
                      Rs. {order.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-[#ddd6cd] bg-[#fbfaf8] px-4 py-14 text-center sm:px-6 sm:py-16">
              <p className="text-xs text-[#8d8379] sm:text-sm">
                {orderId
                  ? "Order not found."
                  : "No orders found for this status."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
