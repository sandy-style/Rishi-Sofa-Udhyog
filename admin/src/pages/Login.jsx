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
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-gradient-to-br
        from-gray-100
        via-white
        to-gray-200
        px-3
        py-6
        sm:px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-2xl
          sm:rounded-3xl
          sm:p-8
        "
      >
        {/* ================= LOGO ================= */}

        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className="
              mb-4
              h-12
              w-auto
              sm:mb-5
              sm:h-16
            "
          />

          <h1
            className="
              text-2xl
              font-bold
              text-gray-800
              sm:text-3xl
            "
          >
            Admin Login
          </h1>

          <p
            className="
              mt-2
              max-w-xs
              text-center
              text-xs
              text-gray-500
              sm:text-sm
            "
          >
            Sign in to manage your furniture store
          </p>
        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={onSubmitHandler}
          className="
            mt-6
            space-y-5
            sm:mt-8
            sm:space-y-6
          "
        >
          {/* ================= USERNAME ================= */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Username
            </label>

            <div
              className="
                flex
                w-full
                items-center
                rounded-xl
                border
                border-gray-300
                px-3
                py-3
                transition
                focus-within:border-black
                focus-within:ring-2
                focus-within:ring-black/10
                sm:px-4
              "
            >
              <FiUser className="shrink-0 text-gray-400" size={18} />

              <input
                onChange={(e) => setUser(e.target.value)}
                value={user}
                type="text"
                placeholder="Enter username"
                autoComplete="username"
                required
                className="
                  ml-3
                  min-w-0
                  w-full
                  bg-transparent
                  text-sm
                  text-gray-900
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>

          {/* ================= PASSWORD ================= */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Password
            </label>

            <div
              className="
                flex
                w-full
                items-center
                rounded-xl
                border
                border-gray-300
                px-3
                py-3
                transition
                focus-within:border-black
                focus-within:ring-2
                focus-within:ring-black/10
                sm:px-4
              "
            >
              <FiLock className="shrink-0 text-gray-400" size={18} />

              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter password"
                autoComplete="current-password"
                required
                className="
                  ml-3
                  min-w-0
                  w-full
                  bg-transparent
                  text-sm
                  text-gray-900
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>

          {/* ================= LOGIN BUTTON ================= */}

          <button
            type="submit"
            className="
              w-full
              rounded-xl
              bg-black
              py-3
              text-sm
              font-semibold
              text-white
              transition
              duration-200
              hover:bg-gray-800
              active:scale-[0.98]
              sm:text-base
            "
          >
            Sign In
          </button>
        </form>

        {/* ================= FOOTER ================= */}

        <p
          className="
            mt-6
            text-center
            text-xs
            leading-relaxed
            text-gray-500
            sm:mt-8
            sm:text-sm
          "
        >
          Restricted access • Authorized administrators only
        </p>
      </div>
    </div>
  );
};

export default Login;
