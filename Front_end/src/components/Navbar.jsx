import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { ShopContext } from "../context/shopContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
const Navbar = ({ setToken, setShowLogin, token }) => {
  const location = useLocation();

  const [menu, setMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState(null);

  const profileRef = useRef(null);

  const { setShowSearch, showSearch, getCartCount, navigate } =
    useContext(ShopContext);

  // ==========================================
  // GET USER DETAILS
  // ==========================================

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/user/getUserData", {
          headers: {
            token: token,
          },
        });

        if (response.data.success) {
          const userData = response.data.userData;

          // This causes Navbar to immediately re-render
          setUserData(userData);

          // Optional: keep it in localStorage
          localStorage.setItem("userData", JSON.stringify(userData));
        }
      } catch (error) {
        console.log("Failed to get user data:", error);
      }
    };

    if (token) {
      getUserData();
    } else {
      setUserData(null);
      localStorage.removeItem("userData");
    }
  }, [token]);

  // ==========================================
  // CLOSE PROFILE WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const logoutHandler = async () => {
    setShowProfile(false);

    localStorage.removeItem("userData");

    setToken("");

    await window.location.reload();
  };

  // ==========================================
  // USER INITIALS
  // ==========================================

  const getInitials = () => {
    if (!userData?.name) return "U";

    const words = userData.name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // ==========================================
  // RANDOM AVATAR COLOR
  // ==========================================

  const avatarColors = [
    "bg-[#B8864C]",
    "bg-[#6B7280]",
    "bg-[#7C6F64]",
    "bg-[#8B7355]",
    "bg-[#5F6F52]",
    "bg-[#8064A2]",
    "bg-[#64748B]",
  ];

  const getAvatarColor = () => {
    if (!userData?.email) return avatarColors[0];

    let hash = 0;

    for (let i = 0; i < userData.email.length; i++) {
      hash = userData.email.charCodeAt(i) + ((hash << 5) - hash);
    }

    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  // ==========================================
  // NAV ITEMS
  // ==========================================

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/collection" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <header className="relative z-40 w-full font-manrope">
        <div className="w-full">
          <div
            className="
              relative
              flex
              items-center
              justify-between
              w-full
              h-16
              sm:h-[72px]
              px-4
              sm:px-6
              lg:px-10
              bg-[#F7F3EE]
              border-b
              border-[#E8DED2]
            "
          >
            {/* ================= LOGO ================= */}

            <Link
              to="/"
              onClick={() => setMenu(false)}
              className="flex items-center shrink-0"
            >
              <img
                src={assets.logo}
                alt="Logo"
                className="
                  w-12
                  sm:w-16
                  md:w-20
                  object-contain
                  cursor-pointer
                "
              />
            </Link>

            {/* ================= DESKTOP NAV ================= */}

            <nav
              className="
                hidden
                lg:flex
                items-center
                gap-1
                absolute
                left-1/2
                -translate-x-1/2
              "
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    relative
                    px-4
                    py-2
                    text-[13px]
                    uppercase
                    tracking-[0.12em]
                    font-medium
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? "text-[#B8864C]"
                        : "text-[#4A4540] hover:text-[#B8864C]"
                    }

                    after:absolute
                    after:left-1/2
                    after:-translate-x-1/2
                    after:-bottom-1
                    after:h-[1.5px]
                    after:bg-[#B8864C]
                    after:transition-all
                    after:duration-300

                    ${isActive ? "after:w-6" : "after:w-0 hover:after:w-6"}
                    `
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* ================= RIGHT SIDE ================= */}

            <div className="flex items-center gap-1 sm:gap-3 ml-auto">
              {/* SEARCH */}

              {location.pathname === "/collection" && (
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="
                    group
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-xl
                    hover:bg-white
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                  aria-label="Search"
                >
                  <Search
                    size={20}
                    strokeWidth={1.7}
                    className="
                      text-[#2C2926]
                      group-hover:text-[#B8864C]
                      group-hover:scale-110
                      transition
                    "
                  />
                </button>
              )}

              {/* CART */}

              <Link
                to="/cart"
                className="
                  group
                  relative
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-xl
                  hover:bg-white
                  transition-all
                  duration-300
                "
              >
                <ShoppingBag
                  size={21}
                  strokeWidth={1.7}
                  className="
                    text-[#2C2926]
                    group-hover:text-[#B8864C]
                    group-hover:scale-110
                    transition
                  "
                />

                {getCartCount() > 0 && (
                  <span
                    className="
                      absolute
                      -top-0.5
                      -right-0.5
                      min-w-[17px]
                      h-[17px]
                      px-1
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-[#B8864C]
                      text-white
                      text-[9px]
                      font-semibold
                    "
                  >
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* ================= DESKTOP AUTH ================= */}

              {!token ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="
                    hidden
                    sm:flex
                    items-center
                    justify-center
                    gap-2
                    h-10
                    px-5
                    rounded-xl
                    bg-[#2C2926]
                    text-white
                    text-xs
                    uppercase
                    tracking-[0.12em]
                    font-medium
                    hover:bg-[#B8864C]
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >
                  <User size={16} strokeWidth={1.8} />
                  <span>Sign In</span>
                </button>
              ) : (
                /* ================= PROFILE ================= */

                <div ref={profileRef} className="hidden sm:block relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="
                      flex
                      items-center
                      justify-center
                      w-10
                      h-10
                      rounded-full
                      hover:scale-105
                      transition-all
                      duration-200
                      cursor-pointer
                      focus:outline-none
                    "
                  >
                    <div
                      className={`
                        w-10
                        h-10
                        rounded-full
                        ${getAvatarColor()}
                        text-white
                        flex
                        items-center
                        justify-center
                        text-md
                        font-semibold
                        uppercase
                        shadow-sm
                      `}
                    >
                      {getInitials()}
                    </div>
                  </button>

                  {/* PROFILE DROPDOWN */}

                  {showProfile && (
                    <div
                      className="
                        absolute
                        right-0
                        top-14
                        w-72
                        bg-white
                        rounded-2xl
                        shadow-xl
                        border
                        border-[#E8DED2]
                        overflow-hidden
                        z-50
                      "
                    >
                      {/* USER INFO */}

                      <div className="px-5 py-5 bg-[#F7F3EE]">
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                              w-12
                              h-12
                              shrink-0
                              rounded-full
                              ${getAvatarColor()}
                              text-white
                              flex
                              items-center
                              justify-center
                              text-sm
                              font-semibold
                            `}
                          >
                            {getInitials()}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#2C2926] truncate">
                              {userData?.name || "User"}
                            </p>

                            <p className="text-xs text-[#8A8178] truncate mt-1">
                              {userData?.email || "Email unavailable"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* PROFILE OPTIONS */}

                      <div className="p-2">
                        <Link
                          to="/orders"
                          onClick={() => setShowProfile(false)}
                          className="
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-xl
                            text-sm
                            text-[#4A4540]
                            hover:bg-[#F7F3EE]
                            hover:text-[#B8864C]
                            transition
                          "
                        >
                          <ShoppingBag size={17} />
                          My Orders
                        </Link>

                        <button
                          onClick={logoutHandler}
                          className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-xl
                            text-sm
                            text-red-500
                            hover:bg-red-50
                            transition
                          "
                        >
                          <LogOut size={17} />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= MOBILE MENU BUTTON ================= */}

              <button
                onClick={() => setMenu(true)}
                className="
                  lg:hidden
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-xl
                  hover:bg-white
                  transition
                  cursor-pointer
                "
                aria-label="Open menu"
              >
                <Menu size={23} strokeWidth={1.7} className="text-[#2C2926]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}

      <div
        onClick={() => setMenu(false)}
        className={`
          fixed
          inset-0
          bg-black/30
          backdrop-blur-[2px]
          z-40
          transition-opacity
          duration-300

          ${
            menu
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      />

      {/* ================= MOBILE SIDE MENU ================= */}

      <aside
        className={`
          fixed
          top-0
          right-0
          z-50
          h-screen
          w-[82%]
          max-w-sm
          bg-[#F7F3EE]
          shadow-[-10px_0_40px_rgba(0,0,0,0.15)]

          transition-transform
          duration-500
          ease-[cubic-bezier(0.4,0,0.2,1)]

          ${menu ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ================= MOBILE HEADER ================= */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-[#E5DCD2]
          "
        >
          <Link to="/" onClick={() => setMenu(false)}>
            <img src={assets.logo} alt="Logo" className="w-16" />
          </Link>

          <button
            onClick={() => setMenu(false)}
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              hover:bg-white
              transition
              cursor-pointer
            "
          >
            <X size={22} strokeWidth={1.7} className="text-[#2C2926]" />
          </button>
        </div>

        {/* ================= MOBILE USER ================= */}

        {token && (
          <div className="px-6 pt-7">
            <div className="flex items-center gap-3">
              <div
                className={`
          w-12
          h-12
          rounded-full
          ${getAvatarColor()}
          text-white
          flex
          items-center
          justify-center
          text-sm
          font-semibold
        `}
              >
                {getInitials()}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#2C2926] truncate">
                  {userData?.name || "User"}
                </p>

                <p className="text-xs text-[#8A8178] truncate mt-1">
                  {userData?.email || "Email unavailable"}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/orders"
                onClick={() => setMenu(false)}
                className="group flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-white border border-[#E5DCD2] text-[#2C2926] hover:bg-[#2C2926] hover:text-white hover:border-[#2C2926] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag
                    size={18}
                    strokeWidth={1.7}
                    className="text-[#B8864C] group-hover:text-white transition-colors duration-300"
                  />

                  <span className="text-sm font-medium">My Orders</span>
                </div>

                <span className="text-[#B8864C] group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* ================= MOBILE NAVIGATION ================= */}

        <nav className="px-6 py-8">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-[#A0968C]
              mb-5
            "
          >
            Navigation
          </p>

          <div className="flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenu(false)}
                className={({ isActive }) =>
                  `
                  group
                  flex
                  items-center
                  justify-between
                  py-4
                  border-b
                  border-[#E5DCD2]
                  text-base
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "text-[#B8864C] pl-2"
                      : "text-[#2C2926] hover:text-[#B8864C] hover:pl-2"
                  }
                  `
                }
              >
                <span>{item.name}</span>

                <span
                  className="
                    text-[#B8864C]
                    opacity-0
                    group-hover:opacity-100
                    transition
                  "
                >
                  →
                </span>
              </NavLink>
            ))}
          </div>

          {/* ================= MOBILE AUTH ================= */}

          <div className="mt-10">
            {!token ? (
              <button
                onClick={() => {
                  setMenu(false);
                  setShowLogin(true);
                }}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-4
                  rounded-xl
                  bg-[#2C2926]
                  text-white
                  uppercase
                  text-xs
                  tracking-[0.15em]
                  hover:bg-[#B8864C]
                  transition
                  cursor-pointer
                "
              >
                <User size={17} />
                Sign In / Register
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenu(false);
                  logoutHandler();
                }}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  py-4
                  rounded-xl
                  bg-[#2C2926]
                  text-white
                  uppercase
                  text-xs
                  tracking-[0.15em]
                  hover:bg-[#B8864C]
                  transition
                  cursor-pointer
                "
              >
                <LogOut size={17} />
                Log Out
              </button>
            )}
          </div>
        </nav>

        {/* ================= MOBILE FOOTER ================= */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            px-6
            py-6
          "
        >
          <div
            className="
              h-px
              bg-[#E5DCD2]
              mb-5
            "
          />

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-[#A0968C]
              text-center
            "
          >
            Crafted for your space
          </p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
