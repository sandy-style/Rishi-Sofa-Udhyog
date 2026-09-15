import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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

import subscribeToPushNotifications from "./utils/pushNotification";

export const backendUrl = import.meta.env.VITE_backend_url;

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const location = useLocation();

  // Check if current page is Agreement
  const isAgreementPage = location.pathname === "/agreement";

  // Keep token in localStorage
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // Register service worker
  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        if (!("serviceWorker" in navigator)) {
          console.log("Service workers are not supported.");
          return;
        }

        await navigator.serviceWorker.register("/sw.js");

        console.log("Service worker registered successfully.");
      } catch (error) {
        console.log("SERVICE WORKER REGISTRATION ERROR:", error);
      }
    };

    registerServiceWorker();
  }, []);

  // Subscribe user to push notifications
  useEffect(() => {
    if (!token) return;

    subscribeToPushNotifications(token);
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7] text-[#29231F]">
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* Hide Navbar on Agreement Page */}
      {!isAgreementPage && (
        <Navbar setToken={setToken} setShowLogin={setShowLogin} token={token} />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Collection */}
          <Route path="/collection" element={<Collection />} />

          {/* About */}
          <Route path="/about" element={<About />} />

          {/* Contact */}
          <Route path="/contact" element={<Contact />} />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* Product Details */}
          <Route
            path="/product/:productId"
            element={<Product setShowLogin={setShowLogin} token={token} />}
          />

          {/* Place Order */}
          <Route path="/placeorder" element={<PlaceOrder />} />

          {/* Orders */}
          <Route path="/orders" element={<Orders />} />

          {/* Agreement / Terms */}
        </Routes>
      </main>

      {/* Hide Footer on Agreement Page */}
      {!isAgreementPage && <Footer />}

      {/* Login Modal */}
      {!token && showLogin && (
        <Login setToken={setToken} setShowLogin={setShowLogin} />
      )}
    </div>
  );
};

export default App;
