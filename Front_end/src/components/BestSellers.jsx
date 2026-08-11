import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { ShopContext } from "../context/shopContext";
import ProductCard from "./ProductCard";

const BestSellers = () => {
  const { products, currency } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  useEffect(() => {
    const bestSofa = products.filter((items) => items.bestSeller);
    setBestSeller(bestSofa.slice(0, 5));
  }, [products]);
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl font-manrope ">
        {" "}
        <Title text1={"best"} text2={"seller"} />
        <p className="text-xs w-3/4 text-[#7E746D] mx-auto sm:text-base">
          Discover our most-loved sofas, crafted with premium materials,
          timeless elegance, and exceptional comfort to elevate every living
          space beautifully.
        </p>
      </div>
      {/* rendering products */}

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {bestSeller.map((item, index) => (
          <ProductCard
            id={item._id}
            key={index}
            image={item.image[0]}
            name={item.name}
            price={item.price}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
