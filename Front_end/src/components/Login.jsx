import React, { useState } from "react";
import { X, Eye, Mail, LockKeyhole, User, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import axios from "axios";
const Login = ({ setShowLogin, setToken }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [show, setShow] = useState("Register");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const registerHandler = async (e) => {
    e.preventDefault();
    console.log("register triggered");
    if (password != confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(backendUrl + "/api/user/register", {
        name,
        email,
        password,
      });
      if (response.data.success) {
        setToken(() => response.data.token);
        setShowLogin(false);
        setName("");
        setEmail("");
        setPassword("");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  const loginHandler = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        setShowLogin(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  return show === "Login" ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button className="absolute top-5 right-5 text-gray-400 hover:text-black transition">
          <X size={21} onClick={() => setShowLogin(false)} />
        </button>

        <div className="px-8 sm:px-10 py-10">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium tracking-tight text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to continue shopping with us
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <button className="text-xs text-gray-500 hover:text-black transition">
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-11 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900 transition"
                />

                {showPassword ? (
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition">
                    <EyeOff
                      onClick={() => setShowPassword(!showPassword)}
                      size={18}
                    />
                  </button>
                ) : (
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition">
                    <Eye
                      onClick={() => setShowPassword(!showPassword)}
                      size={18}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-black"
              />

              <label htmlFor="remember" className="text-sm text-gray-500">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              onClick={loginHandler}
              className="w-full h-12 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Login
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs text-gray-400">OR</span>

            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Create Account */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => setShow("Register")}
              className="font-medium text-black hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      {/* Register Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
        >
          <X size={21} />
        </button>

        <div className="px-8 sm:px-10 py-9">
          {/* Heading */}
          <div className="text-center mb-7">
            <h1 className="text-3xl font-medium tracking-tight text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create your account and start shopping with us
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900 transition"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900 transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full h-12 pl-11 pr-11 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900 transition"
                  required
                />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full h-12 pl-11 pr-11 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900 transition"
                  required
                />

                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 accent-black"
              />

              <label
                htmlFor="terms"
                className="text-xs leading-5 text-gray-500"
              >
                I agree to the{" "}
                <span className="text-black font-medium cursor-pointer">
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span className="text-black font-medium cursor-pointer">
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* Register Button */}
            <button
              onClick={registerHandler}
              className="w-full h-12 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition mt-2"
            >
              Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs text-gray-400">OR</span>

            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Login */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => setShow("Login")}
              className="font-medium text-black hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
