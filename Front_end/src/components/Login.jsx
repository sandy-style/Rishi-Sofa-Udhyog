import React, { useState } from "react";
import {
  X,
  Eye,
  Mail,
  LockKeyhole,
  User,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({ setShowLogin, setToken }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [show, setShow] = useState("Register");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // =========================
  // REGISTER
  // =========================
  const registerHandler = async (e) => {
    e.preventDefault();

    console.log("register triggered");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(backendUrl + "/api/user/register", {
        name,
        email,
        password,
      });

      if (response.data.success && !response.data.verify) {
        setShow("Verify");
        
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error);
    }
  };

  // =========================
  // NORMAL LOGIN
  // =========================
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

        window.location.reload();
      } else if (!response.data.success && response.data.verify === false) {
        setShow("Verify");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);

      console.log(error);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const googleLoginHandler = async (credentialResponse) => {
    try {
      const response = await axios.post(backendUrl + "/api/user/google", {
        credential: credentialResponse.credential,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setShowLogin(false);

        toast.success(response.data.message);

        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Google login error:", error);

      toast.error(
        error.response?.data?.message || error.message || "Google login failed",
      );
    }
  };

  // =========================
  // EMAIL VERIFICATION
  // =========================
  const verificationHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(backendUrl + "/api/user/verify-email", {
        email,
        verificationCode,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setShowLogin(false);

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setVerificationCode("");

        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);

      console.log(error);
    }
  };

  // =========================
  // RESEND VERIFICATION CODE
  // =========================
  const resendVerificationCodeHandler = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/user/resend-code", {
        email,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // LOGIN SCREEN
  // =========================
  switch (show) {
    case "Login":
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
            >
              <X size={21} />
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
                      value={email}
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

                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-black transition"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-12 pl-11 pr-11 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900 transition"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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
                  type="button"
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

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={googleLoginHandler}
                  onError={() => {
                    toast.error("Google login failed");
                  }}
                  width="100%"
                />
              </div>

              {/* Create Account */}
              <p className="text-center text-sm text-gray-500 mt-7">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setShow("Register")}
                  className="font-medium text-black hover:underline"
                >
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>
      );

    // =========================
    // REGISTER SCREEN
    // =========================
    case "Register":
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
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
                      value={name}
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
                      value={email}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="w-full h-12 pl-11 pr-11 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900 transition"
                      required
                    />

                    <button
                      type="button"
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full h-12 pl-11 pr-11 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900 transition"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                  type="button"
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

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={googleLoginHandler}
                  onError={() => {
                    toast.error("Google login failed");
                  }}
                  width="100%"
                />
              </div>

              {/* Login */}
              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <button
                  type="button"
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

    // =========================
    // VERIFY SCREEN
    // =========================
    case "Verify":
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute right-5 top-5 text-gray-400 transition hover:text-black"
            >
              <X size={21} />
            </button>

            <div className="px-8 py-10 sm:px-10">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Mail size={28} className="text-gray-700" />
                </div>
              </div>

              {/* Heading */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-medium tracking-tight text-gray-900">
                  Verify Your Email
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  We've sent a 6-digit verification code to
                </p>

                <p className="mt-1 break-all text-sm font-medium text-gray-900">
                  {email}
                </p>
              </div>

              {/* Verification Form */}
              <div className="space-y-5">
                {/* Code */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>

                  <div className="relative">
                    <ShieldCheck
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter 6-digit code"
                      className="h-12 w-full rounded-lg border border-gray-200 pl-11 pr-4 text-center text-lg tracking-[0.4em] outline-none transition focus:border-gray-900"
                    />
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={verificationHandler}
                  className="h-12 w-full rounded-lg bg-black text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Verify Email
                </button>
              </div>

              {/* Resend */}
              <div className="mt-7 text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive the code?
                </p>

                <button
                  type="button"
                  onClick={resendVerificationCodeHandler}
                  className="mt-1 text-sm font-medium text-black transition hover:underline"
                >
                  Resend Code
                </button>
              </div>

              {/* Cancel */}
              <div className="mt-6 border-t border-gray-100 pt-5 text-center">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="text-xs text-gray-500 transition hover:text-black"
                >
                  Cancel verification
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default Login;
