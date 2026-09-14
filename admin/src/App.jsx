import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Siderbar from "./components/Siderbar";
import { ToastContainer } from "react-toastify";

import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Review from "./pages/Review";

export const backendUrl = import.meta.env.VITE_backend_url;

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : "",
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // ============================================================
  // ADMIN PUSH NOTIFICATION SETUP
  // ============================================================

  useEffect(() => {
    if (!token) return;

    const setupAdminPush = async () => {
      try {
        // Check browser notification support
        if (!("Notification" in window)) {
          console.log("Browser does not support notifications");
          return;
        }

        // Check service worker support
        if (!("serviceWorker" in navigator)) {
          console.log("Service workers are not supported");
          return;
        }

        // Check push notification support
        if (!("PushManager" in window)) {
          console.log("Push notifications are not supported");
          return;
        }

        // Ask for notification permission
        let permission = Notification.permission;

        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        console.log("Admin notification permission:", permission);

        if (permission !== "granted") {
          console.log("Admin notification permission was not granted");
          return;
        }

        // Register admin service worker
        const registration =
          await navigator.serviceWorker.register("/service-worker.js");

        console.log("Admin service worker registered:", registration);

        // Check if browser already has a subscription
        let subscription = await registration.pushManager.getSubscription();

        // Create a new subscription if none exists
        if (!subscription) {
          const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

          if (!vapidPublicKey) {
            console.log("VITE_VAPID_PUBLIC_KEY is missing");
            return;
          }

          const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          });

          console.log("New admin push subscription created:", subscription);
        } else {
          console.log("Existing admin push subscription found:", subscription);
        }

        const subscriptionJson = subscription.toJSON();

        if (!subscriptionJson.keys?.p256dh || !subscriptionJson.keys?.auth) {
          console.log("Push subscription keys are missing");
          return;
        }

        // Save admin subscription to backend
        const response = await axios.post(
          backendUrl + "/api/push/admin-save",
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscriptionJson.keys.p256dh,
              auth: subscriptionJson.keys.auth,
            },
          },
          {
            headers: {
              token,
            },
          },
        );

        console.log("Admin push subscription response:", response.data);
      } catch (error) {
        console.log(
          "ADMIN PUSH SETUP ERROR:",
          error.response?.data || error.message,
        );
      }
    };

    setupAdminPush();
  }, [token]);

  return token ? (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar setToken={setToken} token={token} />

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-72px)]">
        {/* Sidebar */}
        <aside
          className="
            w-16
            sm:w-20
            md:w-64
            shrink-0
            min-h-[calc(100vh-72px)]
            bg-white
            border-r
            shadow-sm
          "
        >
          <Siderbar />
        </aside>

        {/* Main Content */}
        <main
          className="
            flex-1
            min-w-0
            px-3
            sm:px-5
            md:px-8
            py-4
            overflow-y-auto
          "
        >
          <Routes>
            <Route path="/" element={<Add token={token} />} />

            <Route path="/list" element={<List token={token} />} />

            <Route path="/order" element={<Orders token={token} />} />

            <Route path="/order/:orderId" element={<Orders token={token} />} />

            <Route path="/review" element={<Review token={token} />} />

            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>

      <ToastContainer />
    </div>
  ) : (
    <div>
      <Login setToken={setToken} />
    </div>
  );
};

export default App;
