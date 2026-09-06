import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiArrowUpRight } from "react-icons/fi";
import { ShopContext } from "../context/shopContext";

const ProductCard = ({ id, image, name, price, description }) => {
  const { currency, addToCart } = useContext(ShopContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(id);
  };

  return (
    <article className="group relative w-full min-w-0">
      <div
        className="
          relative
          flex
          h-full
          flex-col
          overflow-hidden
         
          border
          border-[#E7DED4]
          bg-[#FCFAF7]
          p-2
          shadow-[0_6px_24px_rgba(73,51,35,0.035)]
          transition-shadow
          duration-500

          
          sm:p-2.5

          
          md:p-3

          hover:shadow-[0_14px_35px_rgba(73,51,35,0.08)]
        "
      >
        {/* =========================================================
            IMAGE SECTION
        ========================================================= */}

        <Link
          to={`/product/${id}`}
          className="
            relative
            block
            overflow-hidden
            
            bg-[#F1ECE6]
            outline-none
            ring-offset-2
            transition-all
            duration-300
            focus-visible:ring-2
            focus-visible:ring-[#79583F]

            
          "
        >
          {/* Soft background glow */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              z-0
              h-[65%]
              w-[65%]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#E8DED2]
              opacity-50
              blur-3xl
              transition-all
              duration-700
              group-hover:scale-110
              group-hover:opacity-70
            "
          />

          {/* Bottom fade */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              z-10
              h-1/3
              bg-gradient-to-t
              from-[#DCD4CC]/40
              to-transparent
            "
          />

          {/* Image container */}
          <div
            className="
              relative
              aspect-[1.08/1]
              w-full
              overflow-hidden
            "
          >
            {/* Product Image */}
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="
                absolute
                bottom-[5%]
                left-1/2
                z-[1]
                h-[78%]
                w-[90%]
                -translate-x-1/2
                object-contain
                drop-shadow-[0_18px_18px_rgba(48,35,26,0.10)]

                transition-transform
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]

                /* ONLY THE IMAGE ZOOMS */
                group-hover:scale-[1.05]

                sm:h-[80%]
                sm:w-[91%]

                md:h-[82%]
                md:w-[92%]
              "
            />
          </div>

          {/* =======================================================
              CART BUTTON
          ======================================================= */}

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
            className="
              absolute
              right-3
              top-3
              z-30
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/95
              text-[#634936]
              shadow-[0_6px_20px_rgba(50,35,25,0.12)]
              backdrop-blur-sm
              transition-all
              duration-300

              hover:scale-110
              hover:bg-[#634936]
              hover:text-white
              hover:shadow-[0_10px_25px_rgba(50,35,25,0.20)]

              active:scale-95

              sm:right-4
              sm:top-4
              sm:h-11
              sm:w-11

              md:h-12
              md:w-12
            "
          >
            <FiShoppingCart
              className="
                text-[15px]

                sm:text-base

                md:text-lg
              "
            />
          </button>
        </Link>

        {/* =========================================================
            PRODUCT INFORMATION
        ========================================================= */}

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
          {/* =======================================================
              PRODUCT NAME
          ======================================================= */}

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
                text-[18px]
                font-medium
                leading-tight
                tracking-[-0.02em]
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

          {/* =======================================================
              DESCRIPTION
          ======================================================= */}

          <p
            className="
              mt-2
              line-clamp-2
              max-w-[95%]
              text-[11px]
              leading-[1.55]
              text-[#8A7A6D]

              sm:text-xs
              sm:leading-5

              md:text-[13px]
            "
          >
            {description}
          </p>

          {/* =======================================================
              PRICE SECTION
          ======================================================= */}

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
            {/* Price */}
            <div>
              <span
                className="
                  block
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#A18C79]

                  sm:text-[10px]

                  md:text-[10px]
                "
              >
                Price
              </span>

              <div
                className="
                  mt-1
                  font-manrope
                  text-[21px]
                  font-semibold
                  leading-none
                  tracking-[-0.04em]
                  text-[#63432F]

                  sm:text-[24px]

                  md:text-[27px]
                "
              >
                {currency}
                {Number(price).toLocaleString("en-IN")}
              </div>
            </div>

            {/* =====================================================
                ARROW BUTTON
            ===================================================== */}

            <Link
              to={`/product/${id}`}
              aria-label={`View ${name}`}
              className="
                flex
                h-9
                w-9
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

                  hover:translate-x-0.5
                  hover:-translate-y-0.5

                  sm:text-base
                "
              />
            </Link>
          </div>

          {/* =======================================================
              VIEW DETAILS BUTTON
          ======================================================= */}

          <Link
            to={`/product/${id}`}
            className="
              relative
              mt-3
              flex
              h-10
              w-full
              items-center
              justify-center
              overflow-hidden
              rounded-[10px]
              border
              border-[#D8C9BA]
              bg-transparent
              px-4
              text-[11px]
              font-semibold
              tracking-[0.01em]
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
              View Details
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
