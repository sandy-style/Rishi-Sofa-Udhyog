import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import ProductCard from "./ProductCard";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const RelatedProducts = ({ material, seating, productId }) => {
  const { products } = useContext(ShopContext);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!products || !products.length) {
      setRelatedProducts([]);
      return;
    }

    const currentProductId = String(productId);

    const filteredProducts = products.filter(
      (item) => String(item._id) !== currentProductId,
    );

    const exactMatches = filteredProducts.filter((item) => {
      const sameMaterial =
        material &&
        item.material &&
        String(item.material).toLowerCase() === String(material).toLowerCase();

      const sameSeating =
        seating &&
        item.seating &&
        String(item.seating).toLowerCase() === String(seating).toLowerCase();

      return sameMaterial || sameSeating;
    });

    const remainingProducts = filteredProducts.filter(
      (item) => !exactMatches.some((related) => related._id === item._id),
    );

    setRelatedProducts([...exactMatches, ...remainingProducts].slice(0, 8));
  }, [products, productId, seating, material]);

  if (!relatedProducts.length) return null;

  return (
    <section className="mt-16 border-t border-[#E7DDD2] pt-12 sm:mt-20 sm:pt-16 lg:mt-24 lg:pt-20">
      <div className="mx-auto max-w-[1550px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="text-center lg:text-left">
            <div className="mb-3 flex items-center justify-center gap-3 lg:justify-start">
              <span className="h-px w-9 bg-[#9A795B] sm:w-10" />

              <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.25em] text-[#8A6B50] sm:text-[10px]">
                You May Also Like
              </span>

              <span className="h-px w-9 bg-[#C8A77F] sm:w-10" />
            </div>

            <h2 className="font-serif text-[30px] font-medium leading-[1.05] tracking-[-0.035em] text-[#2F241D] sm:text-[38px] lg:text-[44px]">
              Complete Your
              <span className="text-[#8A6B50]"> Space</span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-[#7E746D] sm:text-sm sm:leading-6 lg:mx-0 lg:text-base">
              Discover pieces that pair beautifully with your style, material,
              and comfort preferences.
            </p>
          </div>

          <Link
            to="/collection"
            className="group mx-auto inline-flex items-center gap-2 font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-[#634936] transition-colors duration-300 hover:text-[#8A6B50] sm:text-xs lg:mx-0"
          >
            Explore Collection
            <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {relatedProducts.map((item, index) => (
            <div key={item._id || index} className="min-w-0">
              <ProductCard
                id={item._id}
                image={item.image?.[0]}
                name={item.name}
                price={item.price}
                description={item.description}
                offer={item.offer}
                stock={item.stock}
                bestSeller={item.bestSeller}
                category={item.category}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
