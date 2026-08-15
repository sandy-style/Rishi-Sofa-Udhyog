import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        console.log(response.data);
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const [showCustomerInfo, setShowCustomerInfo] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, [token]);
  return (
    <div className="min-h-screen  px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* PAGE HEADER */}
        <div className="mb-10">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#9b8f82]">
            Store Management
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-normal tracking-tight text-[#292521]">
                Orders
              </h1>

              <p className="mt-2 text-sm text-[#857a70]">
                Manage deliveries, customers and order information.
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-medium text-[#292521]">
                {orders.length}
              </p>

              <p className="text-xs uppercase tracking-wider text-[#9b8f82]">
                Total Orders
              </p>
            </div>
          </div>
        </div>

        {/* ORDER LIST */}
        <div className="space-y-8">
          {orders.map((order, index) => (
            <div
              key={index}
              className="overflow-hidden border border-[#ddd6cd] bg-[#fbfaf8]"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-col gap-5 border-b border-[#e1dbd3] bg-[#f9f6f1] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-medium text-[#292521]">
                      #{order.id}
                    </h2>

                    <span className="h-1 w-1 rounded-full bg-[#b6aa9d]" />

                    <p className="text-xs text-[#8d8379]">{order.date}</p>
                  </div>

                  <p className="mt-2 text-xs text-[#8d8379]">
                    Customer:{" "}
                    <span className="text-[#4e4740]">
                      {order.address.firstName} {order.address.lastName}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* PAYMENT */}
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      order.payment
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {order.payment ? "Payment Paid" : "Payment Pending"}
                  </span>

                  {/* ORDER STATUS */}
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-700"
                        : order.status === "Shipped"
                          ? "bg-blue-50 text-blue-700"
                          : order.status === "Cancelled"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>

                  {/* STATUS SELECT */}
                  <select
                    defaultValue={order.status}
                    className="cursor-pointer border border-[#d5cdc3] bg-white px-3 py-2 text-xs text-[#4e4740] outline-none focus:border-[#9b8f82]"
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              {/* CUSTOMER INFO BUTTON */}
              <div className="border-b border-[#e3ddd5] px-6 py-4">
                <button
                  onClick={() =>
                    setShowCustomerInfo(
                      showCustomerInfo === order.id ? null : order.id,
                    )
                  }
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[#756b61] transition hover:text-[#292521]"
                >
                  <span>{showCustomerInfo === order.id ? "−" : "+"}</span>

                  {showCustomerInfo === order.id
                    ? "Hide Customer Info"
                    : "Show Customer Info"}
                </button>
              </div>

              {/* CUSTOMER INFORMATION */}
              {showCustomerInfo === order.id && (
                <div className="grid border-b border-[#e3ddd5] bg-[#faf8f5] lg:grid-cols-2">
                  {/* CUSTOMER */}
                  <div className="border-b border-[#e3ddd5] p-6 lg:border-b-0 lg:border-r">
                    <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9b8f82]">
                      Customer Information
                    </p>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#aaa095]">
                          Name
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#292521]">
                          {order.address.firstName}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#aaa095]">
                          Email
                        </p>

                        <p className="mt-1 text-sm text-[#4e4740]">
                          {order.address.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#aaa095]">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-[#4e4740]">
                          {order.address.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DELIVERY ADDRESS */}
                  <div className="p-6">
                    <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9b8f82]">
                      Delivery Address
                    </p>

                    <div className="space-y-1 text-sm leading-relaxed text-[#4e4740]">
                      <p className="font-medium text-[#292521]">
                        {order.address.firstName}
                      </p>

                      <p>{order.address.street}</p>

                      <p>
                        {order.address.city}, {order.customer.address.province}
                      </p>

                      <p>{order.address.country} </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              <div>
                <div className="border-b border-[#e3ddd5] px-6 py-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#9b8f82]">
                    Ordered Products
                  </p>
                </div>

                <div className="divide-y divide-[#eee9e2]">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center"
                    >
                      {/* IMAGE */}
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-[#eee9e2]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* PRODUCT INFO */}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-[#292521]">
                          {item.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#8b8177]">
                          <span>Color: {item.color}</span>

                          <span>Quantity: {item.quantity}</span>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="sm:text-right">
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
              <div className="flex flex-col gap-5 border-t border-[#ddd6cd] bg-[#f8f5f0] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-[#8b8177]">Payment Method</p>

                  <p className="mt-1 text-sm font-medium text-[#4e4740]">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#9b9187]">Order Total</p>

                  <p className="mt-1 text-lg font-medium text-[#292521]">
                    Rs. {order.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
