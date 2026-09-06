import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Siderbar from "./components/Siderbar";
import { ToastContainer } from "react-toastify";

import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./pages/Login";

export const backendUrl = import.meta.env.VITE_backend_url;

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : "",
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return token ? (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar setToken={setToken} />

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
