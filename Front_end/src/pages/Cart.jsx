import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "../components/Title";
import { Navigate } from "react-router-dom";
import CartTotal from "../components/CartTotal";
const Cart = () => {
  const { products, cartItem, currency, updateCart, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItem) {
      if (cartItem[items] > 0) {
        tempData.push({
          _id: items,
          quantity: cartItem[items],
        });
      }
    }
    setCartData(tempData);
  }, [cartItem]);

  return (
    <div className="flex-col gap-6">
      <div className="text-2xl">
        <Title text1={"cart"} text2={"Information"} />
      </div>
      {cartData.map((item, index) => {
        const productData = products.find((items) => item._id == items._id);
        return (
          <div
            key={index}
            className="bg-[#FAF7F2] border border-[#E4DDD4] rounded-3xl p-6 shadow-sm mb-2 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image */}
              <div className="w-36 h-36 rounded-2xl overflow-hidden bg-[#F2ECE4] flex items-center justify-center">
                <img
                  src={productData.image[0]}
                  alt=""
                  className="w-full h-full object-fit hover:scale-105 transition duration-500"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading text-2xl text-[#231F1C]">
                    {productData.style}
                  </h2>

                  <p className="font-manrope text-[#8A7F74] mt-2">
                    {productData.name}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className="text-2xl font-semibold text-[#231F1C]">
                    {currency} {productData.price}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Quantity */}

                    <div className="flex items-center bg-white border border-[#DED7CE] rounded">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateCart(item._id, item.quantity - 1);
                          }
                        }}
                        className="px-4 py-2 hover:bg-[#F3EEE8] transition"
                      >
                        −
                      </button>

                      <span className="px-4 font-medium">{item.quantity}</span>

                      <button
                        onClick={() => updateCart(item._id, item.quantity + 1)}
                        className="px-4 py-2 hover:bg-[#F3EEE8] transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete */}

                    <button
                      onClick={() => updateCart(item._id, 0)}
                      className="w-11 h-11 rounded-full hover:bg-red-50 transition flex items-center justify-center"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        );
      })}{" "}
      <div className="flex w-full max-w-md flex-col    md:ml-auto  ">
        <CartTotal />
        <button
          onClick={() =>
            cartData.length > 0
              ? navigate("/placeorder")
              : navigate("/collection")
          }
          className="w-full mt-8 bg-[#231F1C] text-white py-3 rounded-xl hover:bg-[#3A342F] transition-all duration-300 font-medium capitalize"
        >
          {cartData.length > 0 ? "Proceed to checkOut" : "explore collection"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
