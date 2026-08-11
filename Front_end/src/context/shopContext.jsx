import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
export const ShopContext = createContext();
const ShopContextProvider = (props) => {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const currency = "Rs.";
  const delievery_fee = 10;
  const [cartItem, setCartItem] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const productFetch = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/admin/listproducts");
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (productId) => {
    let cartData = structuredClone(cartItem);
    if (cartData[productId]) {
      cartData[productId] += 1;
    } else {
      cartData[productId] = 1;
    }
    setCartItem(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      totalCount += cartItem[items];
    }

    return totalCount;
  };

  const updateCart = (itemId, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId] = quantity;
    setCartItem(cartData);
  };
  const totalAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((item) => item._id === items);
      totalAmount += itemInfo.price * cartItem[items];
    }
    console.log(totalAmount);

    return totalAmount;
  };
  useEffect(() => {
    productFetch();
  }, []);

  const value = {
    products,
    currency,
    delievery_fee,
    showSearch,
    setShowSearch,
    search,
    setSearch,
    getCartCount,
    addToCart,
    cartItem,
    updateCart,
    navigate,
    totalAmount,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
