import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import Orders from "./pages/Orders";

export const backendUrl = import.meta.env.VITE_backend_url;

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7] text-[#29231F]">
      {/* ================= TOAST ================= */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* ================= NAVBAR ================= */}
      <Navbar setToken={setToken} setShowLogin={setShowLogin} token={token} />

      {/* ================= PAGE CONTENT ================= */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/collection" element={<Collection />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/product/:productId"
            element={<Product setShowLogin={setShowLogin} token={token} />}
          />

          <Route path="/placeorder" element={<PlaceOrder />} />

          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= LOGIN MODAL ================= */}
      {!token && showLogin && (
        <Login setToken={setToken} setShowLogin={setShowLogin} />
      )}
    </div>
  );
};

export default App;
