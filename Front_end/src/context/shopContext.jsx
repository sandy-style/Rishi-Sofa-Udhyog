import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
export const ShopContext = createContext();
const ShopContextProvider = (props) => {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const currency = "Rs.";
  const delievery_fee = 10;
  const [cartItem, setCartItem] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : "",
  );

  const getProductsFromCart = async () => {
    console.log(token);
    try {
      const response = await axios.get(
        backendUrl + "/api/cart/get",

        {
          headers: {
            token: token,
          },
        },
      );
      if (response.data.success) {
        console.log(response.data.message);
        setCartItem(response.data.cartData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

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
    try {
      console.log(token);
      const response = await axios.post(
        backendUrl + "/api/cart/add",

        { itemId: productId },
        {
          headers: {
            token: token,
          },
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        let cartData = structuredClone(cartItem);
        if (cartData[productId]) {
          cartData[productId] += 1;
        } else {
          cartData[productId] = 1;
        }
        setCartItem(cartData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      totalCount += cartItem[items];
    }

    return totalCount;
  };

  const updateCart = async (itemId, quantity) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/update",
        {
          itemId: itemId,
          quantity: quantity,
        },
        {
          headers: {
            token,
          },
        },
      );
      if (response.data.success) {
        let cartData = structuredClone(cartItem);

        if (quantity === 0) {
          delete cartData[itemId];
        } else {
          cartData[itemId] = quantity;
        }

        setCartItem(cartData);
        console.log("update success");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const totalAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((item) => item._id === items);
      if (!itemInfo) {
        continue;
      }
      totalAmount += itemInfo.price * cartItem[items];
    }
    console.log(totalAmount);

    return totalAmount;
  };
  useEffect(() => {
    productFetch();
  }, []);

  useEffect(() => {
    if (token) {
      getProductsFromCart();
    }
  }, [token]);

  const value = {
    getProductsFromCart,
    setCartItem,
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
