import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/shopContext";
import Title from "../components/Title";
import ProductCard from "../components/ProductCard";
import RelatedProducts from "../components/RelatedProducts";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
const Product = ({ token, setShowLogin }) => {
  const { productId } = useParams();
  const { products, currency, addToCart, getProductsFromCart } =
    useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [image, setImage] = useState("");
  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
    getProductsFromCart();
  }, [products, productId]);

  return productData ? (
    <div className=" border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:flex-row flex-col">
        {/* products images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col  flex-row overflow-x-auto justify-normal sm:justify-normal sm:overflow-y-scroll sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer shadow-lg bg-[#F6F2EC]  border   border-[#f4c179]"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <div className=" bg-[#F6F2EC]  borderborder-[#E6DED3] rounded-lg p-8  flex items-center justify-center min-h-[520px]">
              <img
                className="w-full max-w-lg object-contain transition duration-300 border border-[#f4c179] hover:scale-[1.02]"
                src={image}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-medium font-heading text-[#231F1C]">
            {productData.name}
          </h1>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[#D69C3D] tracking-wide text-lg">★★★★★</span>
            <p className="text-sm text-gray-500">(126 Reviews)</p>
          </div>
          <p className="font-medium font-manrope text-2xl mt-4">
            {currency}
            {productData.price}
          </p>
          <p className="text-xs md:text-base text-[#6D655D] font-manrope mt-5  capitalize">
            {productData.description}
          </p>{" "}
          <div className="my-10">
            <h2 className="font-heading text-3xl text-[#231F1C] mb-6">
              Product Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F8F4EE] border border-[#E8DED2] rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <p className="text-xs uppercase tracking-[0.2em] text-[#9A8F84]">
                  Seating
                </p>
                <p className="mt-2 text-lg font-semibold text-[#231F1C]">
                  {productData.seating}
                </p>
              </div>

              <div className="bg-[#F8F4EE] border border-[#E8DED2] rounded-xl p-5 shadow-sm hover:shadow-md transition capitalize">
                <p className="text-xs uppercase tracking-[0.2em] text-[#9A8F84] ">
                  Material
                </p>
                <p className="mt-2 text-lg font-semibold text-[#231F1C]">
                  {productData.material}
                </p>
              </div>

              <div className="bg-[#F8F4EE] border border-[#E8DED2] rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <p className="text-xs uppercase tracking-[0.2em] text-[#9A8F84]">
                  Color
                </p>
                <p className="mt-2 text-lg font-semibold text-[#231F1C]">
                  {productData.color.join(", ")}
                </p>
              </div>
            </div>
            <div className="mt-10">
              {" "}
              <div>
                <button
                  onClick={() =>
                    token ? addToCart(productId, token) : setShowLogin(true)
                  }
                  className="group relative overflow-hidden  border border-[#C99658] bg-[#C99658] px-10 py-4 font-manrope text-lg font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                  <span className="relative z-10 flex items-center gap-3 transition-colors duration-300 ">
                    Add to Cart
                    <FiShoppingCart className="h-5 w-5 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 " />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 font-manrope">
        <div className="flex bg-transparent">
          <b className="border border-orange-300 text-[#231F1C] px-5 py-3 text-sm">
            Description
          </b>
          <p className="border border-orange-300 px-5 py-3 text-sm">
            Reviews (126)
          </p>
        </div>
        <div className="flex flex-col gap-4 border border-orange-300 px-6 py-6 text-sm text-[#6D655D]">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
        </div>
      </div>
      <RelatedProducts
        seating={productData.seating}
        material={productData.material}
        productId={productId}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
