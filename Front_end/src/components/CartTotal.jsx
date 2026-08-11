import React, { useContext } from "react";
import { ShopContext } from "../context/shopContext";

const CartTotal = () => {
  const { navigate, delievery_fee, totalAmount, currency, getCartCount } =
    useContext(ShopContext);
  return (
    <div>
      <div className="w-full max-w-md  bg-transparent rounded-2xl border border-[#E7E1D8] p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#231F1C] mb-6">
          Cart Total
        </h2>

        <div className="space-y-4 text-[#6D655D]">
          <div className="flex justify-between items-center capitalize">
            <span>subTotal</span>
            <span className="font-medium text-[#231F1C]">
              {currency}
              {totalAmount()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Delivery Fee</span>
            <span className="font-medium text-[#231F1C]">
              {currency}
              {getCartCount() > 0 ? delievery_fee : "0"}
            </span>
          </div>

          <div className="border-t border-[#E7E1D8] pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-[#231F1C]">Total</span>
            <span className="text-2xl font-bold text-[#C99658]">
              {currency}
              {getCartCount() > 0 ? totalAmount() + delievery_fee : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
