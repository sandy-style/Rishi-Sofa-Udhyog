import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { ShopContext } from "../context/shopContext";

const ProductCard = ({ id, image, name, price }) => {
  const { currency, addToCart } = useContext(ShopContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(id);
  };

  return (
    <div className="group block">
      <div
        className="
          rounded-[32px]
          bg-[#FBF8F4]
          p-5
          transition-all
          duration-500
          ease-out
          hover:-translate-y-2
          hover:bg-[#F2E5D6]
          hover:shadow-[0_22px_55px_rgba(115,82,45,0.18)]
          hover:ring-1
          hover:ring-[#E8DCCF]
        "
      >
        {/* Image Section */}
        <Link to={`/product/${id}`}>
          <div className="relative h-[360px] overflow-hidden rounded-[24px]">
            {/* Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="
                absolute
                top-5
                right-5
                z-20
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-white
                text-[#6A4E3B]
                shadow-xl
                transition-all
                duration-300
                hover:scale-110
                hover:bg-[#B08A58]
                hover:text-white
              "
              aria-label="Add to cart"
            >
              <FiShoppingCart size={20} />
            </button>

            {/* Vignette */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-10
                bg-gradient-to-t
                from-black/10
                via-transparent
                to-transparent
                opacity-100
              "
            />

            {/* Product Image */}
            <img
              src={image}
              alt={name}
              className="
                absolute
                bottom-6
                left-1/2
                h-[250px]
                w-auto
                -translate-x-1/2
                object-contain
                transition-all
                duration-700
                ease-out
                group-hover:scale-105
                group-hover:-translate-y-2
              "
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="mt-7">
          <Link to={`/product/${id}`}>
            <h3
              className="
                font-serif
                text-[22px]
                text-[#3B2B20]
                transition-colors
                duration-300
                hover:text-[#5F4633]
              "
            >
              {name}
            </h3>
          </Link>

          <p
            className="
              mt-3
              text-2xl
              font-medium
              text-[#B07B45]
            "
          >
            {currency}
            {price}
          </p>

          {/* View Details Button */}
          <Link
            to={`/product/${id}`}
            className="
              mt-5
              flex
              w-full
              items-center
              justify-center
              rounded-xl
              border
              border-[#CDBEAE]
              bg-transparent
              px-5
              py-3
              text-sm
              font-medium
              text-[#5C4737]
              transition-all
              duration-300
              hover:border-[#6A4E3B]
              hover:bg-[#6A4E3B]
              hover:text-white
            "
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
