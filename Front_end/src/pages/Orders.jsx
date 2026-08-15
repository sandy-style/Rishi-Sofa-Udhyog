import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

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
      return "bg-emerald-50 text-emerald-700 border border-emerald-100";

    case "processing":
      return "bg-amber-50 text-amber-700 border border-amber-100";

    case "shipped":
      return "bg-blue-50 text-blue-700 border border-blue-100";

    case "cancelled":
      return "bg-red-50 text-red-600 border border-red-100";

    default:
      return "bg-gray-50 text-gray-600 border border-gray-200";
  }
};

const getOrderStatusDot = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-emerald-500";

    case "processing":
      return "bg-amber-500";

    case "shipped":
      return "bg-blue-500";

    case "cancelled":
      return "bg-red-500";

    default:
      return "bg-gray-400";
  }
};

const Orders = () => {
  const { currency, token, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

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
        console.log(response.data.orders);
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

  return (
    <div className="min-h-screen bg-[#f7f3ed] px-6 py-16 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9b8f82]">
            Account
          </p>

          <h1 className="text-3xl font-normal tracking-tight text-[#292521] sm:text-4xl">
            My Orders
          </h1>

          <div className="mx-auto mt-5 h-px w-10 bg-[#b8a894]" />
        </div>

        {/* Orders */}
        <div>
          {orderData.map((order) =>
            order.items.map((item, index) => (
              <div
                key={`${order._id}-${index}`}
                className="grid grid-cols-1 gap-8 border-b border-[#ded7ce] py-10 sm:grid-cols-[220px_1fr_auto] sm:gap-10"
              >
                {/* Product Image */}
                <div className="h-48 w-full overflow-hidden bg-[#ebe5dd] sm:h-40">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>

                {/* Product Information */}
                <div className="flex flex-col justify-center">
                  {/* Order ID */}
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#a69a8d]">
                    Order #{order._id.slice(0, 5)}
                  </p>

                  {/* Product Name */}
                  <h2 className="text-xl font-medium tracking-tight text-[#292521]">
                    {item.name}
                  </h2>

                  {/* Product Details */}
                  <div className="mt-5 space-y-1.5 text-sm text-[#756b61]">
                    <p>Quantity: {item.quantity}</p>

                    <p>{formatDate(order.date)}</p>

                    <p>
                      Payment:{" "}
                      <span className="text-[#4e4740]">
                        {order.paymentMethod}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Price + Status */}
                <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                  {/* Price */}
                  <p className="text-lg font-medium tracking-tight text-[#292521]">
                    {currency}
                    {item.price.toLocaleString()}
                  </p>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {/* Order Status */}
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${getOrderStatusStyle(
                        order.status,
                      )}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getOrderStatusDot(
                          order.status,
                        )}`}
                      />

                      {order.status}
                    </span>

                    {/* Payment Status */}
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                        order.payment
                          ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                          : "border border-orange-100 bg-orange-50 text-orange-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          order.payment ? "bg-emerald-500" : "bg-orange-500"
                        }`}
                      />

                      {order.payment ? "Paid" : "Payment Pending"}
                    </span>
                  </div>
                </div>
              </div>
            )),
          )}
        </div>

        {/* Empty State */}
        {orderData.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-sm text-[#756b61]">
              You haven't placed any orders yet.
            </p>

            <button
              onClick={() => navigate("/collection")}
              className="mt-6 border-b border-[#292521] pb-1 text-sm text-[#292521] transition hover:border-[#9b8f82] hover:text-[#9b8f82]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
