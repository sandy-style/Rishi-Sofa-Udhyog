import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "./Title";
import ProductCard from "./ProductCard";
const RelatedProducts = ({ material, seating, productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { products } = useContext(ShopContext);
  useEffect(() => {
    const notproducts = products.filter((item) => item._id !== productId);
    let relatedFinder;

    relatedFinder = notproducts.filter(
      (item) => item.seating === seating || item.material === material,
    );
    setRelatedProducts(relatedFinder.slice(0, 9));
  }, [productId, products, seating, material]);
  return (
    <>
      <div className="flex flex-col mt-10">
        <div className="flex justify-center items-center font-heading text-2xl">
          <Title text1={"Related"} text2={"Products"} />
        </div>
      </div>
      <div className="grid grid-cols-2 w-full h-full md:grid-cols-3 md:gap-2">
        {relatedProducts.map((item, index) => (
          <ProductCard
            id={item._id}
            key={index}
            image={item.image[0]}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </>
  );
};

export default RelatedProducts;
