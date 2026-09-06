import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";

const Cart = () => {
  const { products, cartItem, currency, updateCart, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  // =========================================================
  // BUILD CART DATA
  // =========================================================

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

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (cartData.length === 0) {
    return (
      <section
        className="
          mx-auto
          max-w-[1450px]
          px-4
          py-12

          sm:px-6
          sm:py-16

          lg:px-8
          lg:py-20
        "
      >
        {/* HEADER */}

        <div className="mb-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#A97849]" />

            <span
              className="
                font-manrope
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#947963]
              "
            >
              Your Selection
            </span>
          </div>

          <div className="mt-4">
            <Title text1="Cart" text2="Information" />
          </div>
        </div>

        {/* EMPTY STATE */}

        <div
          className="
            flex
            min-h-[430px]
            flex-col
            items-center
            justify-center
            rounded-[24px]
            border
            border-[#E5DBD1]
            bg-[#F7F2EC]
            px-6
            text-center

            sm:rounded-[30px]
          "
        >
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-[#D8C9BA]
              bg-[#FCFAF7]
              text-[#A97849]
            "
          >
            <FiShoppingBag className="text-2xl" />
          </div>

          <h2
            className="
              mt-7
              font-heading
              text-2xl
              font-medium
              text-[#342A24]

              sm:text-3xl
            "
          >
            Your cart is empty
          </h2>

          <p
            className="
              mt-3
              max-w-md
              font-manrope
              text-xs
              leading-6
              text-[#82766C]

              sm:text-sm
            "
          >
            Discover thoughtfully designed pieces made to bring comfort and
            character into your living space.
          </p>

          <button
            type="button"
            onClick={() => navigate("/collection")}
            className="
              group
              mt-7
              flex
              items-center
              gap-3
              rounded-xl
              bg-[#A97849]
              px-6
              py-3.5
              font-heading
              text-[15px]
              font-medium
              text-white
              shadow-[0_10px_25px_rgba(139,96,57,0.18)]
              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:bg-[#8C633F]
            "
          >
            Explore Collection
            <FiArrowRight
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN CART
  // =========================================================

  return (
    <section
      className="
        mx-auto
        max-w-[1450px]
        px-4
        py-10

        sm:px-6
        sm:py-14

        lg:px-8
        lg:py-20
      "
    >
      {/* =======================================================
          HEADER
      ======================================================= */}
      {/* =======================================================
    HEADER
======================================================= */}

      <div className="mb-9 sm:mb-12">
        <div className="flex items-center gap-4">
          <span className="h-[2px] w-10 bg-[#A97849] sm:w-12" />

          <h1
            className="
        font-heading
        text-[30px]
        font-medium
        leading-none
        tracking-[-0.025em]
        text-[#342A24]

        sm:text-[38px]

        lg:text-[44px]
      "
          >
            Cart Information
          </h1>
        </div>

        <p
          className="
      mt-4
      max-w-xl
      font-manrope
      text-xs
      leading-6
      text-[#81756C]

      sm:mt-5
      sm:text-sm
    "
        >
          Review your selected pieces before moving forward.
        </p>
      </div>

      {/* =======================================================
          CONTENT GRID
      ======================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-8

          lg:grid-cols-[minmax(0,1fr)_380px]
          lg:gap-12

          xl:grid-cols-[minmax(0,1fr)_410px]
        "
      >
        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <div className="min-w-0">
          {/* Product count */}

          <div
            className="
              mb-4
              flex
              items-center
              justify-between
              border-b
              border-[#E5DBD2]
              pb-4
            "
          >
            <p
              className="
                font-manrope
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#806F62]
              "
            >
              {cartData.length} {cartData.length === 1 ? "Item" : "Items"}
            </p>

            <p
              className="
                font-manrope
                text-[10px]
                uppercase
                tracking-[0.12em]
                text-[#A18F81]
              "
            >
              Your Bag
            </p>
          </div>

          {/* ===================================================
              PRODUCT LIST
          =================================================== */}

          <div className="space-y-4 sm:space-y-5">
            {cartData.map((item, index) => {
              const productData = products.find(
                (items) => item._id === items._id,
              );

              if (!productData) return null;

              return (
                <div
                  key={index}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#E3D9D0]
                    bg-[#F9F5F0]
                    p-3

                    transition-all
                    duration-300

                    hover:border-[#D5C5B5]
                    hover:shadow-[0_18px_45px_rgba(76,57,42,0.07)]

                    sm:rounded-[24px]
                    sm:p-4

                    lg:p-5
                  "
                >
                  <div
                    className="
                      flex
                      gap-4

                      sm:gap-5

                      md:gap-6
                    "
                  >
                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div
                      className="
                        relative
                        h-[105px]
                        w-[105px]
                        shrink-0
                        overflow-hidden
                        rounded-[16px]
                        bg-[#EEE7DF]

                        sm:h-[135px]
                        sm:w-[135px]
                        sm:rounded-[18px]

                        md:h-[155px]
                        md:w-[155px]
                      "
                    >
                      <img
                        src={productData.image?.[0]}
                        alt={productData.name}
                        className="
                          h-full
                          w-full
                          object-contain
                          p-2

                          transition-transform
                          duration-700

                          group-hover:scale-[1.06]
                        "
                      />
                    </div>

                    {/* =================================================
                        PRODUCT CONTENT
                    ================================================= */}

                    <div
                      className="
                        flex
                        min-w-0
                        flex-1
                        flex-col
                      "
                    >
                      {/* Product name */}

                      <div className="pr-8">
                        {productData.style && (
                          <p
                            className="
                              mb-1
                              font-manrope
                              text-[8px]
                              font-semibold
                              uppercase
                              tracking-[0.2em]
                              text-[#A18469]

                              sm:text-[9px]
                            "
                          >
                            {productData.style}
                          </p>
                        )}

                        <h2
                          className="
                            line-clamp-2
                            font-heading
                            text-[17px]
                            font-medium
                            leading-tight
                            text-[#342A24]

                            sm:text-xl

                            md:text-2xl
                          "
                        >
                          {productData.name}
                        </h2>
                      </div>

                      {/* Description */}

                      {productData.description && (
                        <p
                          className="
                            mt-2
                            hidden
                            max-w-lg
                            line-clamp-2
                            font-manrope
                            text-[11px]
                            leading-5
                            text-[#897C72]

                            sm:block
                            sm:text-xs
                          "
                        >
                          {productData.description}
                        </p>
                      )}

                      {/* =================================================
                          BOTTOM ROW
                      ================================================= */}

                      <div
                        className="
                          mt-auto
                          flex
                          flex-wrap
                          items-end
                          justify-between
                          gap-3
                          pt-4

                          sm:pt-5
                        "
                      >
                        {/* Price */}

                        <div>
                          <p
                            className="
                              mb-1
                              font-manrope
                              text-[8px]
                              font-medium
                              uppercase
                              tracking-[0.18em]
                              text-[#A18F81]
                            "
                          >
                            Price
                          </p>

                          <p
                            className="
                              font-heading
                              text-lg
                              font-medium
                              tracking-[-0.02em]
                              text-[#624936]

                              sm:text-xl

                              md:text-2xl
                            "
                          >
                            {currency}
                            {Number(productData.price).toLocaleString("en-IN")}
                          </p>
                        </div>

                        {/* Quantity */}

                        <div
                          className="
                            flex
                            h-9
                            items-center
                            overflow-hidden
                            rounded-lg
                            border
                            border-[#D9CEC4]
                            bg-white

                            sm:h-10
                            sm:rounded-xl
                          "
                        >
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateCart(item._id, item.quantity - 1);
                              }
                            }}
                            className="
                              flex
                              h-full
                              w-9
                              items-center
                              justify-center
                              text-[#66564B]
                              transition-colors

                              hover:bg-[#F1EAE3]

                              disabled:cursor-not-allowed
                              disabled:opacity-30

                              sm:w-10
                            "
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="text-[11px]" />
                          </button>

                          <span
                            className="
                              flex
                              h-full
                              min-w-9
                              items-center
                              justify-center
                              border-x
                              border-[#E2D9D1]
                              font-manrope
                              text-xs
                              font-semibold
                              text-[#443830]

                              sm:min-w-10
                            "
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateCart(item._id, item.quantity + 1)
                            }
                            className="
                              flex
                              h-full
                              w-9
                              items-center
                              justify-center
                              text-[#66564B]
                              transition-colors

                              hover:bg-[#F1EAE3]

                              sm:w-10
                            "
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="text-[11px]" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        REMOVE BUTTON
                    ================================================= */}

                    <button
                      type="button"
                      onClick={() => updateCart(item._id, 0)}
                      className="
                        absolute
                        right-3
                        top-3
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        text-[#9A897D]
                        transition-all
                        duration-300

                        hover:bg-[#EDE0D7]
                        hover:text-[#8B5D42]

                        sm:right-4
                        sm:top-4
                      "
                      aria-label={`Remove ${productData.name}`}
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            ORDER SUMMARY
        ===================================================== */}

        <aside
          className="
            h-fit

            lg:sticky
            lg:top-28
          "
        >
          <div
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-[#E0D5CB]
              bg-[#F5EFE8]
              p-5

              sm:rounded-[26px]
              sm:p-7

              lg:p-8
            "
          >
            {/* Summary header */}

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[#A97849]" />

                <span
                  className="
                    font-manrope
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-[#967B64]
                  "
                >
                  Order Summary
                </span>
              </div>

              <h2
                className="
                  mt-3
                  font-heading
                  text-2xl
                  font-medium
                  text-[#342A24]

                  sm:text-3xl
                "
              >
                Your Order
              </h2>
            </div>

            {/* Cart total */}

            <div
              className="
                border-y
                border-[#DED2C7]
                py-5
              "
            >
              <CartTotal />
            </div>

            {/* Checkout */}

            <button
              type="button"
              onClick={() => navigate("/placeorder")}
              className="
                group
                mt-6
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                bg-[#342A24]
                px-5
                py-4
                font-heading
                text-[15px]
                font-medium
                text-white
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-[#4A392E]
                hover:shadow-[0_14px_30px_rgba(52,42,36,0.18)]
              "
            >
              <span>Proceed to Checkout</span>

              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition-transform
                  duration-300

                  group-hover:translate-x-1
                "
              >
                <FiArrowRight className="text-sm" />
              </span>
            </button>

            {/* Continue shopping */}

            <button
              type="button"
              onClick={() => navigate("/collection")}
              className="
                mt-4
                flex
                w-full
                items-center
                justify-center
                gap-2
                py-2
                font-manrope
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[#806F62]
                transition-colors
                duration-300

                hover:text-[#A97849]
              "
            >
              Continue Shopping
              <FiArrowRight className="text-xs" />
            </button>

            {/* Small reassurance */}

            <div
              className="
                mt-6
                border-t
                border-[#DED2C7]
                pt-5
              "
            >
              <p
                className="
                  text-center
                  font-manrope
                  text-[9px]
                  leading-5
                  text-[#96887D]
                "
              >
                Carefully selected pieces for a more beautiful everyday living
                space.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
