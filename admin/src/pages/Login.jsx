import React, { useState } from "react";
import { FiLock, FiUser } from "react-icons/fi";
import logo from "../assets/logo.svg";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
const Login = ({ setToken }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/api/user/admin", {
        user,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Admin logged in");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-200 p-8">
        {/* Logo */}

        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="h-16 mb-5" />

          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your furniture store
          </p>
        </div>

        {/* Form */}

        <form onSubmit={(e) => onSubmitHandler(e)} className="mt-8 space-y-6">
          {/* Username */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>

            <div className="flex items-center rounded-xl border border-gray-300 px-4 py-3 focus-within:ring-2 focus-within:ring-black">
              <FiUser className="text-gray-400" size={18} />

              <input
                onChange={(e) => setUser(e.target.value)}
                type="text"
                placeholder="Enter username"
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="flex items-center rounded-xl border border-gray-300 px-4 py-3 focus-within:ring-2 focus-within:ring-black">
              <FiLock className="text-gray-400" size={18} />

              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
                className="ml-3 w-full outline-none"
              />
            </div>
          </div>

          {/* Login Button */}

          <button
            type="submit"
            className="w-full rounded-xl bg-black py-3 font-semibold text-white transition duration-200 hover:bg-gray-800 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Restricted access • Authorized administrators only
        </p>
      </div>
    </div>
  );
};

export default Login;
