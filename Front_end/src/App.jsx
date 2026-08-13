import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Footer from "./components/Footer";
import PlaceOrder from "./pages/PlaceOrder";
export const backendUrl = import.meta.env.VITE_backend_url;
const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : "",
  );
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <>
      <ToastContainer />
      <div className="px-3 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Navbar setToken={setToken} setShowLogin={setShowLogin} token={token} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/product/:productId"
            element={<Product token={token} />}
          />

          <Route path="/placeorder" element={<PlaceOrder />} />
        </Routes>
        <Footer />
      </div>
      {!token && showLogin && (
        <Login setToken={setToken} setShowLogin={setShowLogin} />
      )}
    </>
  );
};

export default App;
