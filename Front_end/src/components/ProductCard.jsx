import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { ShopContext } from "../context/shopContext";

const ProductCard = ({ id, image, name, price }) => {
  const { currency, cartItemCounter } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="group block cursor-pointer">
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
        <div className="relative h-[360px] overflow-hidden rounded-[24px]">
          {/* Cart Button */}
          <button
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
              opacity-0
              translate-y-2
              transition-all
              duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
              hover:bg-[#B08A58]
              hover:text-white
            "
          >
            <FiShoppingCart size={20} />
          </button>

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 opacity-100"></div>

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

        {/* Product Info */}
        <div className="mt-8">
          <h3 className="font-serif text-[22px] text-[#3B2B20] transition-colors duration-300 group-hover:text-[#5F4633]">
            {name}
          </h3>

          <p className="mt-3 text-2xl font-medium text-[#B07B45] transition-colors duration-300 group-hover:text-[#9A6634]">
            {currency}
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
