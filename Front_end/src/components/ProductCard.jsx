import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiArrowUpRight, FiCheck, FiTag } from "react-icons/fi";
import { ShopContext } from "../context/shopContext";

const ProductCard = ({
  id,
  image,
  name,
  price,
  description,
  offer,
  stock,
  bestSeller,
  category,
}) => {
  const { currency, addToCart } = useContext(ShopContext);

  const isInStock =
    stock === true || stock === "true" || stock === 1 || stock === "1";

  const isBestSeller =
    bestSeller === true ||
    bestSeller === "true" ||
    bestSeller === 1 ||
    bestSeller === "1";

  const offerIsActive =
    offer?.isActive === true ||
    offer?.isActive === "true" ||
    offer?.isActive === 1 ||
    offer?.isActive === "1";

  const originalPrice = Math.max(0, Number(price) || 0);
  const discountValue = Math.max(0, Number(offer?.discountValue) || 0);

  const discountType = offer?.discountType;

  const isOfferActive =
    offerIsActive &&
    discountValue > 0 &&
    (discountType === "percentage" || discountType === "flat");

  let finalPrice = originalPrice;
  let discountAmount = 0;
  let discountPercentage = 0;

  if (isOfferActive) {
    if (discountType === "percentage") {
      discountPercentage = Math.min(100, discountValue);

      discountAmount = (originalPrice * discountPercentage) / 100;

      finalPrice = originalPrice - discountAmount;
    }

    if (discountType === "flat") {
      discountAmount = Math.min(originalPrice, discountValue);

      finalPrice = originalPrice - discountAmount;

      discountPercentage =
        originalPrice > 0
          ? Math.round((discountAmount / originalPrice) * 100)
          : 0;
    }

    finalPrice = Math.max(0, finalPrice);
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) return;

    addToCart(id);
  };

  const formattedCategory = category
    ? String(category)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : null;

  return (
    <article className="group relative w-full min-w-0">
      <div
        className="
          relative
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-[2px]
          border
          border-[#E6DCD1]
          bg-[#FCFAF7]
          p-2
          shadow-[0_5px_25px_rgba(73,51,35,0.035)]
          transition-all
          duration-500
          hover:-translate-y-1
          hover:border-[#D8C8B8]
          hover:shadow-[0_18px_45px_rgba(73,51,35,0.10)]

          sm:p-2.5
          md:p-3
        "
      >
        <div className="relative overflow-hidden bg-[#F1ECE6]">
          <Link
            to={`/product/${id}`}
            className="
              relative
              block
              overflow-hidden
              outline-none
              focus-visible:ring-2
              focus-visible:ring-[#79583F]
              focus-visible:ring-offset-2
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                z-0
                h-[62%]
                w-[62%]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#E6D9CB]
                opacity-50
                blur-3xl
                transition-all
                duration-700
                group-hover:scale-125
                group-hover:opacity-75
              "
            />

            <div
              className="
                relative
                aspect-[1.08/1]
                w-full
                overflow-hidden
              "
            >
              <img
                src={image}
                alt={name}
                loading="lazy"
                decoding="async"
                className="
                  absolute
                  bottom-[4%]
                  left-1/2
                  z-[1]
                  h-[76%]
                  w-[88%]
                  -translate-x-1/2
                  object-contain
                  drop-shadow-[0_18px_18px_rgba(48,35,26,0.10)]
                  transition-transform
                  duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-[1.05]

                  sm:h-[81%]
                  sm:w-[91%]
                  sm:group-hover:scale-[1.07]

                  md:h-[83%]
                  md:w-[92%]
                "
              />
            </div>

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                z-10
                h-1/3
                bg-gradient-to-t
                from-[#CFC4B9]/30
                to-transparent
              "
            />

            {isOfferActive && offer?.offerTitle && (
              <div
                className="
                  absolute
                  bottom-2
                  right-2
                  z-20

                  sm:bottom-3
                  sm:right-3

                  md:bottom-4
                  md:right-4
                "
              >
                <div
                  className="
                    relative
                    flex
                    h-[50px]
                    w-[50px]
                    rotate-[8deg]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#B91C1C]
                    text-center
                    text-white
                    shadow-[0_6px_16px_rgba(127,29,29,0.30)]
                    transition-all
                    duration-500
                    group-hover:rotate-[2deg]
                    group-hover:scale-105

                    sm:h-[64px]
                    sm:w-[64px]
                    sm:shadow-[0_8px_20px_rgba(127,29,29,0.32)]

                    md:h-[76px]
                    md:w-[76px]
                    md:shadow-[0_10px_25px_rgba(127,29,29,0.35)]
                  "
                >
                  <div
                    className="
                      absolute
                      inset-[3px]
                      rounded-full
                      border
                      border-dashed
                      border-white/70

                      sm:inset-[4px]
                    "
                  />

                  <div
                    className="
                      absolute
                      -top-[3px]
                      left-1/2
                      h-2
                      w-2
                      -translate-x-1/2
                      rotate-45
                      bg-[#B91C1C]

                      sm:-top-1
                      sm:h-2.5
                      sm:w-2.5

                      md:h-3
                      md:w-3
                    "
                  />

                  <div
                    className="
                      relative
                      z-10
                      flex
                      max-w-[38px]
                      flex-col
                      items-center
                      justify-center
                      gap-0

                      sm:max-w-[50px]
                      sm:gap-0.5

                      md:max-w-[62px]
                    "
                  >
                    <span
                      className="
                        text-[5px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-white/80

                        sm:text-[6px]
                        sm:tracking-[0.14em]

                        md:text-[7px]
                        md:tracking-[0.15em]
                      "
                    >
                      Special
                    </span>

                    <span
                      className="
                        line-clamp-2
                        text-[7px]
                        font-black
                        uppercase
                        leading-[1.05]
                        tracking-[0.02em]
                        text-white

                        sm:text-[8px]
                        sm:tracking-[0.03em]

                        md:line-clamp-3
                        md:text-[9px]
                        md:tracking-[0.04em]
                      "
                    >
                      {offer.offerTitle}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div
              className="
                absolute
                left-3
                top-3
                z-20
                hidden
                flex-col
                items-start
                gap-1.5

                sm:flex
                sm:left-4
                sm:top-4
              "
            >
              {isBestSeller && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-[#634936]
                    px-2.5
                    py-1.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-white
                    shadow-sm

                    sm:px-3
                    sm:text-[9px]
                  "
                >
                  <span className="h-1 w-1 rounded-full bg-white" />
                  Best Seller
                </span>
              )}

              {isOfferActive && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-white/70
                    bg-white/95
                    px-2.5
                    py-1.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#634936]
                    shadow-sm
                    backdrop-blur-sm

                    sm:px-3
                    sm:text-[9px]
                  "
                >
                  <FiTag className="text-[10px]" />
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {isInStock && !isOfferActive && !isBestSeller && (
              <div
                className="
                  absolute
                  bottom-3
                  left-3
                  z-20
                  hidden
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-white/70
                  bg-white/90
                  px-2.5
                  py-1.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-[#634936]
                  shadow-sm
                  backdrop-blur-sm

                  sm:flex
                  sm:left-4
                  sm:bottom-4
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#7A9A72]" />
                In Stock
              </div>
            )}

            {!isInStock && (
              <div
                className="
                  absolute
                  inset-0
                  z-20
                  flex
                  items-center
                  justify-center
                  bg-[#30231B]/25
                  backdrop-blur-[2px]
                "
              >
                <span
                  className="
                    rounded-full
                    bg-white
                    px-4
                    py-2
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-[#634936]
                    shadow-lg
                  "
                >
                  Out of Stock
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isInStock}
            aria-label={
              isInStock ? `Add ${name} to cart` : `${name} is out of stock`
            }
            className={`
              absolute
              right-2
              top-2
              z-30
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/95
              text-[#634936]
              shadow-[0_7px_20px_rgba(50,35,25,0.13)]
              backdrop-blur-sm
              transition-all
              duration-300

              sm:right-3
              sm:top-3
              sm:h-11
              sm:w-11

              md:right-4
              md:top-4
              md:h-12
              md:w-12

              ${
                isInStock
                  ? `
                    hover:scale-110
                    hover:bg-[#634936]
                    hover:text-white
                    hover:shadow-[0_10px_25px_rgba(50,35,25,0.22)]
                    active:scale-95
                  `
                  : `
                    cursor-not-allowed
                    opacity-50
                  `
              }
            `}
          >
            {isInStock ? (
              <FiShoppingCart
                className="
                  text-[14px]
                  transition-transform
                  duration-300
                  group-hover:scale-105

                  sm:text-base
                  md:text-lg
                "
              />
            ) : (
              <FiCheck className="text-base" />
            )}
          </button>
        </div>

        <div
          className="
            flex
            flex-1
            flex-col
            px-2
            pb-2
            pt-4

            sm:px-2.5
            sm:pb-2.5
            sm:pt-5

            md:px-3
            md:pb-3
            md:pt-5
          "
        >
          {formattedCategory && (
            <p
              className="
                mb-2
                text-[8px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#A18C79]

                sm:text-[9px]
              "
            >
              {formattedCategory}
            </p>
          )}

          <Link
            to={`/product/${id}`}
            className="
              block
              outline-none
              focus-visible:underline
              focus-visible:underline-offset-4
            "
          >
            <h3
              className="
                line-clamp-1
                font-serif
                text-[16px]
                font-medium
                leading-tight
                tracking-[-0.025em]
                text-[#30231B]
                transition-colors
                duration-300
                group-hover:text-[#634936]

                sm:text-[20px]
                md:text-[22px]
              "
            >
              {name}
            </h3>
          </Link>

          <p
            className="
              mt-2
              line-clamp-2
              max-w-[95%]
              text-[10px]
              leading-[1.55]
              text-[#8A7A6D]

              sm:text-xs
              sm:leading-5

              md:text-[13px]
            "
          >
            {description}
          </p>

          <div
            className="
              mt-4
              flex
              items-end
              justify-between
              border-t
              border-[#E8DED4]
              pt-4

              sm:mt-5
              sm:pt-5

              md:mt-6
              md:pt-5
            "
          >
            <div>
              <span
                className="
                  block
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#A18C79]

                  sm:text-[9px]
                "
              >
                {isOfferActive ? "Special Price" : "Price"}
              </span>

              <div
                className="
                  mt-1.5
                  flex
                  flex-wrap
                  items-baseline
                  gap-x-2
                  gap-y-1
                "
              >
                <span
                  className="
                    font-manrope
                    text-[18px]
                    font-semibold
                    leading-none
                    tracking-[-0.045em]
                    text-[#63432F]

                    sm:text-[24px]
                    md:text-[27px]
                  "
                >
                  {currency}
                  {Math.round(finalPrice).toLocaleString("en-IN")}
                </span>

                {isOfferActive && (
                  <span
                    className="
                      text-[9px]
                      text-[#A18C79]
                      line-through

                      sm:text-xs
                    "
                  >
                    {currency}
                    {Math.round(originalPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {isOfferActive && (
                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-[#EFE6DC]
                      px-2
                      py-1
                      text-[9px]
                      font-semibold
                      text-[#634936]

                      sm:text-[10px]
                    "
                  >
                    <FiTag className="text-[10px]" />
                    {discountPercentage}% OFF
                  </span>

                  {discountAmount > 0 && (
                    <span
                      className="
                        text-[9px]
                        font-medium
                        text-[#7A8C6A]

                        sm:text-[10px]
                      "
                    >
                      Save {currency}
                      {Math.round(discountAmount).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              )}

              {!isOfferActive && (
                <p
                  className="
                    mt-1.5
                    text-[9px]
                    text-[#A18C79]

                    sm:text-[10px]
                  "
                >
                  Regular Price
                </p>
              )}
            </div>

            <Link
              to={`/product/${id}`}
              aria-label={`View ${name}`}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#DCCFC1]
                text-[#765B45]
                transition-all
                duration-300
                hover:border-[#634936]
                hover:bg-[#634936]
                hover:text-white

                sm:h-10
                sm:w-10

                md:h-11
                md:w-11
              "
            >
              <FiArrowUpRight
                className="
                  text-sm
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5

                  sm:text-base
                "
              />
            </Link>
          </div>

          <Link
            to={`/product/${id}`}
            className="
              relative
              mt-3
              flex
              h-9
              w-full
              items-center
              justify-center
              overflow-hidden
              rounded-[10px]
              border
              border-[#D8C9BA]
              bg-transparent
              px-3
              text-[9px]
              font-semibold
              tracking-[0.03em]
              text-[#634936]
              transition-all
              duration-300
              before:absolute
              before:inset-0
              before:-translate-x-full
              before:bg-[#634936]
              before:transition-transform
              before:duration-500
              before:ease-out
              hover:border-[#634936]
              hover:text-white
              hover:before:translate-x-0

              sm:mt-4
              sm:h-11
              sm:rounded-[11px]
              sm:px-4
              sm:text-xs

              md:mt-4
              md:h-12
              md:text-sm
            "
          >
            <span
              className="
                relative
                z-10
                flex
                items-center
                gap-2
              "
            >
              Explore Product
              <FiArrowUpRight
                className="
                  text-sm
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
