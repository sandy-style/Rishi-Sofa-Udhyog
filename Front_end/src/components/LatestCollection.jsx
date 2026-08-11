import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "./Title";
import ProductCard from "./ProductCard";
const LatestCollection = () => {
  const { products, currency } = useContext(ShopContext);
  const [latest, setLatest] = useState([]);
  useEffect(() => {
    setLatest(products.slice(0, 10));
  }, [products]);
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl font-manrope ">
        {" "}
        <Title text1={"Latest"} text2={"Collection"} />
        <p className="text-xs w-3/4 text-[#7E746D] mx-auto sm:text-base">
          Experience our newest sofa designs, combining premium quality, elegant
          craftsmanship, and unmatched comfort to elevate every living space
          with style.
        </p>
      </div>
      {/* rendering products */}

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {latest.map((item, index) => (
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

export default LatestCollection;
