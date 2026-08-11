import React, { useState } from "react";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
const PlaceOrder = () => {
  const [payMethod, setPayMethod] = useState("COD");

  return (
    <div>
      <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* ================= DELIVERY FORM ================= */}
          <div className="flex-1 bg-white shadow-lg border border-[#DED7CE] rounded-3xl p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-['Cormorant_Garamond'] text-[#231F1C]">
                Delivery Details
              </h2>
              <p className="text-sm text-[#6D655D] mt-1">
                Fill in your shipping information.
              </p>
            </div>

            <form className="space-y-5">
              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4]
            placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4]
            placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4]
            placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4]
            placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                />
              </div>

              {/* Address */}
              <input
                type="text"
                placeholder="Street Address"
                className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4]
          placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
              />

              {/* Apartment */}
              <input
                type="text"
                placeholder="Apartment, Suite (Optional)"
                className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4]
          placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
              />

              {/* City & Province */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4]
            placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                />

                <select
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4]
            outline-none focus:border-[#C99658] transition text-[#6D655D]"
                >
                  <option>Select Province</option>
                  <option>Koshi</option>
                  <option>Madhesh</option>
                  <option>Bagmati</option>
                  <option>Gandaki</option>
                  <option>Lumbini</option>
                  <option>Karnali</option>
                  <option>Sudurpashchim</option>
                </select>
              </div>

              {/* Postal Code & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE] bg-[#F9F7F4]
            placeholder:text-[#8A8178] outline-none focus:border-[#C99658] transition"
                />

                <input
                  type="text"
                  value="Nepal"
                  readOnly
                  className="w-full h-11 px-4 rounded-xl border border-[#DED7CE]
            bg-[#EFEAE3] text-[#6D655D]"
                />
              </div>
            </form>
          </div>

          {/* ================= CART TOTAL ================= */}

          <div className="w-full lg:w-[360px]">
            <div className="sticky top-24 bg-white border border-[#DED7CE] rounded-3xl p-6">
              {/* Replace with your CartTotal component */}

              <CartTotal />
              <div className="w-full rounded-xl border border-gray-200 p-4 bg-white flex flex-col">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Payment Method
                </h3>

                <div className=" flex flex-col gap-4">
                  {/* eSewa */}
                  <div
                    onClick={() => setPayMethod("esewa")}
                    className={`${payMethod === "esewa" ? "bg-green-100" : ""} flex items-center justify-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition`}
                  >
                    <img
                      src={assets.esewa_logo}
                      alt="eSewa"
                      className="w-20 object-fill "
                    />
                  </div>

                  {/* Khalti */}
                  <div
                    onClick={() => setPayMethod("khalti")}
                    className={` ${payMethod === "khalti" ? "bg-purple-100" : ""} flex items-center justify-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition`}
                  >
                    <img
                      src={assets.khalti_logo}
                      alt="Khalti"
                      className="h-8 object-contain"
                    />
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPayMethod("COD")}
                    className={`${payMethod === "COD" ? "bg-orange-100" : ""} flex items-center justify-center border rounded-lg p-4 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition`}
                  >
                    <span className="font-medium text-gray-700">
                      Cash on Delivery
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-6 py-3 rounded-xl bg-[#231F1C] text-white
          hover:bg-[#C99658] hover:text-[#231F1C]
          transition-all duration-300 font-medium"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
