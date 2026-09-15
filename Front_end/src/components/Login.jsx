import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";
import { GoogleLogin } from "@react-oauth/google";
import Agreement from "./Agreement";

const Login = ({ setShowLogin, setToken }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [show, setShow] = useState("Register");

  // Agreement popup
  const [showAgreement, setShowAgreement] = useState(false);

  // Terms checkbox
  const [terms, setTerms] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // ============================================
  // REGISTER
  // ============================================

  const registerHandler = async () => {
    try {
      if (!name.trim()) {
        toast.error("Please enter your name");
        return;
      }

      if (!email.trim()) {
        toast.error("Please enter your email");
        return;
      }

      if (!password) {
        toast.error("Please enter your password");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // IMPORTANT:
      // Native required checkbox validation does not
      // work here because the button is type="button".
      if (!terms) {
        toast.error("Please accept the Terms & Agreement");
        return;
      }

      const response = await axios.post(backendUrl + "/api/user/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        if (response.data.verify === false) {
          setShow("Verify");
          toast.success(response.data.message);
        } else {
          setShow("Login");
          toast.success(response.data.message);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  // ============================================
  // LOGIN
  // ============================================

  const loginHandler = async () => {
    try {
      if (!email.trim()) {
        toast.error("Please enter your email");
        return;
      }

      if (!password) {
        toast.error("Please enter your password");
        return;
      }

      const response = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });

      if (response.data.success) {
        if (response.data.verify === false) {
          setShow("Verify");
          toast.info(response.data.message || "Please verify your email");
          return;
        }

        const token = response.data.token;

        localStorage.setItem("token", token);
        setToken(token);
        setShowLogin(false);

        toast.success(response.data.message || "Login successful");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  // ============================================
  // GOOGLE LOGIN
  // ============================================

  const googleLoginHandler = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Google login failed");
        return;
      }

      const response = await axios.post(backendUrl + "/api/user/google", {
        credential: credentialResponse.credential,
      });

      if (response.data.success) {
        const token = response.data.token;

        localStorage.setItem("token", token);
        setToken(token);
        setShowLogin(false);

        toast.success(response.data.message || "Google login successful");
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || error.message || "Google login failed",
      );
    }
  };

  // ============================================
  // VERIFY EMAIL
  // ============================================

  const verificationHandler = async () => {
    try {
      if (!verificationCode.trim()) {
        toast.error("Please enter the verification code");
        return;
      }

      const response = await axios.post(backendUrl + "/api/user/verify-email", {
        email,
        verificationCode,
      });
      if (response.data.success) {
        const token = response.data.token;

        localStorage.setItem("token", token);
        setToken(token);
        setShowLogin(false);

        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setVerificationCode("");
        setTerms(false);
        window.location.reload();
        toast.success(response.data.message || "Email verified successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || error.message || "Verification failed",
      );
    }
  };

  // ============================================
  // RESEND VERIFICATION CODE
  // ============================================

  const resendVerificationCodeHandler = async () => {
    try {
      if (!email.trim()) {
        toast.error("Email is required");
        return;
      }

      const response = await axios.post(backendUrl + "/api/user/resend-code", {
        email,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to resend verification code",
      );
    }
  };

  // ============================================
  // SWITCH REGISTER / LOGIN
  // ============================================

  const switchMode = (mode) => {
    setShow(mode);

    // Reset terms when switching away from register
    if (mode !== "Register") {
      setTerms(false);
    }
  };

  return (
    <>
      {/* ========================================
          LOGIN / REGISTER MODAL
      ======================================== */}

      <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#E5DDD3] bg-[#F8F5F0] shadow-[0_25px_80px_rgba(59,43,32,0.25)]">
          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#3B2B20] shadow-sm transition hover:bg-[#3B2B20] hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* ==================================
              VERIFY EMAIL
          ================================== */}

          {show === "Verify" ? (
            <div className="p-7 sm:p-8">
              <button
                type="button"
                onClick={() => switchMode("Login")}
                className="mb-6 flex items-center gap-2 text-sm text-[#7E746D] transition hover:text-[#3B2B20]"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>

              <div className="mb-7">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B07B45]">
                  RSU Furniture
                </p>

                <h2 className="font-['Cormorant_Garamond'] text-4xl font-semibold text-[#3B2B20]">
                  Verify Email
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#7E746D]">
                  We have sent a verification code to your email address.
                </p>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E746D]"
                  />

                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="h-12 w-full rounded-xl border border-[#DED7CE] bg-[#EFEAE3] pl-11 pr-4 text-sm text-[#6D655D] outline-none"
                  />
                </div>

                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="h-12 w-full rounded-xl border border-[#DED7CE] bg-white px-4 text-center text-sm tracking-[0.25em] outline-none transition focus:border-[#B07B45]"
                  maxLength={6}
                />

                <button
                  type="button"
                  onClick={verificationHandler}
                  className="h-12 w-full rounded-xl bg-[#3B2B20] text-sm font-semibold text-white transition hover:bg-[#B07B45]"
                >
                  Verify Email
                </button>

                <button
                  type="button"
                  onClick={resendVerificationCodeHandler}
                  className="w-full text-sm font-medium text-[#B07B45] transition hover:text-[#3B2B20]"
                >
                  Resend Verification Code
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ==================================
                  HEADER
              ================================== */}

              <div className="border-b border-[#E5DDD3] bg-[#FBF8F4] px-7 pb-6 pt-8 sm:px-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B07B45]">
                  RSU Furniture
                </p>

                <h2 className="font-['Cormorant_Garamond'] text-4xl font-semibold text-[#3B2B20]">
                  {show === "Register" ? "Create Account" : "Welcome Back"}
                </h2>

                <p className="mt-2 text-sm text-[#7E746D]">
                  {show === "Register"
                    ? "Create your RSU account and start shopping."
                    : "Sign in to continue to your account."}
                </p>
              </div>

              {/* ==================================
                  FORM CONTENT
              ================================== */}

              <div className="px-7 py-7 sm:px-8">
                {/* =================================
                    REGISTER
                ================================= */}

                {show === "Register" && (
                  <div className="space-y-4">
                    {/* NAME */}

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E746D]"
                      />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="h-12 w-full rounded-xl border border-[#DED7CE] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#B07B45]"
                      />
                    </div>

                    {/* EMAIL */}

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E746D]"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="h-12 w-full rounded-xl border border-[#DED7CE] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#B07B45]"
                      />
                    </div>

                    {/* PASSWORD */}

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E746D]"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="h-12 w-full rounded-xl border border-[#DED7CE] bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#B07B45]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7E746D] hover:text-[#3B2B20]"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E746D]"
                      />

                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="h-12 w-full rounded-xl border border-[#DED7CE] bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#B07B45]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7E746D] hover:text-[#3B2B20]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* TERMS */}

                    <div className="flex items-start gap-3 pt-1">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={terms}
                        onChange={(e) => setTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 cursor-pointer accent-[#3B2B20]"
                      />

                      <label
                        htmlFor="terms"
                        className="text-xs leading-5 text-[#7E746D]"
                      >
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={() => setShowAgreement(true)}
                          className="font-semibold text-[#B07B45] underline underline-offset-2 hover:text-[#3B2B20]"
                        >
                          Terms & Conditions
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={() => setShowAgreement(true)}
                          className="font-semibold text-[#B07B45] underline underline-offset-2 hover:text-[#3B2B20]"
                        >
                          Privacy Policy
                        </button>
                        .
                      </label>
                    </div>

                    {/* REGISTER BUTTON */}

                    <button
                      type="button"
                      onClick={registerHandler}
                      className="h-12 w-full rounded-xl bg-[#3B2B20] text-sm font-semibold text-white transition hover:bg-[#B07B45]"
                    >
                      Create Account
                    </button>

                    {/* GOOGLE */}

                    <div className="relative py-1">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#E5DDD3]" />
                      </div>

                      <div className="relative flex justify-center">
                        <span className="bg-[#F8F5F0] px-3 text-xs text-[#9A9188]">
                          OR
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={googleLoginHandler}
                        onError={() => toast.error("Google login failed")}
                        width="100%"
                      />
                    </div>

                    {/* SWITCH TO LOGIN */}

                    <p className="pt-2 text-center text-sm text-[#7E746D]">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("Login")}
                        className="font-semibold text-[#B07B45] hover:text-[#3B2B20]"
                      >
                        Login
                      </button>
                    </p>
                  </div>
                )}

                {/* =================================
                    LOGIN
                ================================= */}

                {show === "Login" && (
                  <div className="space-y-4">
                    {/* EMAIL */}

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E746D]"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="h-12 w-full rounded-xl border border-[#DED7CE] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#B07B45]"
                      />
                    </div>

                    {/* PASSWORD */}

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7E746D]"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="h-12 w-full rounded-xl border border-[#DED7CE] bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#B07B45]"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7E746D] hover:text-[#3B2B20]"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* LOGIN BUTTON */}

                    <button
                      type="button"
                      onClick={loginHandler}
                      className="h-12 w-full rounded-xl bg-[#3B2B20] text-sm font-semibold text-white transition hover:bg-[#B07B45]"
                    >
                      Login
                    </button>

                    {/* GOOGLE */}

                    <div className="relative py-1">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#E5DDD3]" />
                      </div>

                      <div className="relative flex justify-center">
                        <span className="bg-[#F8F5F0] px-3 text-xs text-[#9A9188]">
                          OR
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={googleLoginHandler}
                        onError={() => toast.error("Google login failed")}
                        width="100%"
                      />
                    </div>

                    {/* SWITCH TO REGISTER */}

                    <p className="pt-2 text-center text-sm text-[#7E746D]">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("Register")}
                        className="font-semibold text-[#B07B45] hover:text-[#3B2B20]"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================
          AGREEMENT POPUP
      ======================================== */}

      {showAgreement && (
        <Agreement
          onClose={() => setShowAgreement(false)}
          onAccept={() => {
            // User accepted the agreement
            setTerms(true);

            // Close agreement popup
            setShowAgreement(false);
          }}
        />
      )}
    </>
  );
};

export default Login;
