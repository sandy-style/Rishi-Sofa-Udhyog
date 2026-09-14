import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiBell,
} from "react-icons/fi";
import axios from "axios";
import { ShopContext } from "../context/shopContext";
import { backendUrl } from "../App";
import Notification from "./Notification";

const Navbar = ({ setToken, setShowLogin, token }) => {
  const { getCartCount } = useContext(ShopContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // USER DATA
  const [userData, setUserData] = useState(null);

  // NOTIFICATIONS
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // REFS
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const cartCount = getCartCount ? getCartCount() : 0;

  // =========================================================
  // GET USER DATA
  // =========================================================

  const loadUserData = async () => {
    try {
      if (!token) {
        setUserData(null);
        return;
      }

      const response = await axios.get(backendUrl + "/api/user/getuserdata", {
        headers: {
          token: token,
        },
      });

      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        console.log(response.data.message);
        setUserData(null);
      }
    } catch (error) {
      console.log("LOAD USER DATA ERROR:", error);
      setUserData(null);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [token]);

  // =========================================================
  // GET NOTIFICATIONS
  // =========================================================

  const loadNotifications = async () => {
    try {
      if (!token) {
        setNotifications([]);
        return;
      }

      const response = await axios.get(backendUrl + "/api/notification/list", {
        headers: {
          token: token,
        },
      });

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.log("LOAD NOTIFICATIONS ERROR:", error);
    }
  };

  // =========================================================
  // GET UNREAD NOTIFICATION COUNT
  // =========================================================

  const loadUnreadCount = async () => {
    try {
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await axios.get(
        backendUrl + "/api/notification/unread-count",
        {
          headers: {
            token: token,
          },
        },
      );

      if (response.data.success) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (error) {
      console.log("LOAD UNREAD COUNT ERROR:", error);
    }
  };

  // =========================================================
  // INITIAL NOTIFICATION LOAD
  // + AUTO REFRESH EVERY 10 SECONDS
  // =========================================================

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Load immediately
    loadNotifications();
    loadUnreadCount();

    // Refresh every 10 seconds
    const notificationInterval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 10000);

    return () => {
      clearInterval(notificationInterval);
    };
  }, [token]);

  // =========================================================
  // OPEN / CLOSE NOTIFICATIONS
  // =========================================================

  const toggleNotifications = async () => {
    const willOpen = !notificationOpen;

    setNotificationOpen(willOpen);

    // Refresh immediately when opening
    if (willOpen) {
      await loadNotifications();
      await loadUnreadCount();
    }

    setProfileOpen(false);
  };

  // =========================================================
  // CLOSE POPUPS WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================================================
  // SCROLL
  // =========================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken("");
    setUserData(null);
    setNotifications([]);
    setUnreadCount(0);
    setProfileOpen(false);
    setNotificationOpen(false);

    navigate("/");
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  // =========================================================
  // NAV ITEMS
  // =========================================================

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/collection" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <header
        className={`
          fixed
          left-0
          right-0
          top-0
          z-50
          transition-all
          duration-500

          ${
            scrolled
              ? "bg-[#FCFAF7]/90 shadow-[0_8px_30px_rgba(60,45,35,0.07)] backdrop-blur-xl"
              : "bg-[#FCFAF7]"
          }
        `}
      >
        <div
          className="
            mx-auto
            flex
            h-[76px]
            max-w-[1600px]
            items-center
            justify-between
            px-5

            sm:h-[82px]
            sm:px-8

            lg:px-10

            xl:px-14
          "
        >
          {/* =====================================================
              LOGO
          ===================================================== */}

          <Link
            to="/"
            onClick={closeMobile}
            className="group relative flex items-center"
          >
            <div className="flex flex-col">
              <span
                className="
                  font-heading
                  text-[25px]
                  font-medium
                  leading-none
                  tracking-[-0.035em]
                  text-[#332922]

                  sm:text-[28px]
                "
              >
                RSU
              </span>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-px w-5 bg-[#A97849]" />

                <span
                  className="
                    font-manrope
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.32em]
                    text-[#947963]
                  "
                >
                  & furnitures
                </span>
              </div>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <nav
            className="
              hidden
              items-center
              gap-9
              lg:flex
              xl:gap-11
            "
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group
                  relative
                  py-3

                  font-heading
                  text-[17px]
                  font-medium
                  tracking-[-0.01em]

                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "text-[#8C633F]"
                      : "text-[#4B4038] hover:text-[#A97849]"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{item.name}</span>

                    <span
                      className={`
                        absolute
                        bottom-1
                        left-0
                        h-[1.5px]
                        bg-[#A97849]
                        transition-all
                        duration-400
                        ease-out

                        ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                      `}
                    />

                    <span
                      className={`
                        absolute
                        -right-2
                        top-2
                        h-1
                        w-1
                        rounded-full
                        bg-[#A97849]
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? "scale-100 opacity-100"
                            : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                        }
                      `}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* =====================================================
              RIGHT ACTIONS
          ===================================================== */}

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="
                mr-1
                hidden
                h-7
                w-px
                bg-[#DDD2C8]
                lg:block
              "
            />

            {/* ===================================================
                USER
            =================================================== */}

            {token ? (
              <div ref={profileRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationOpen(false);
                  }}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[#DDD1C5]
                    bg-white/50
                    px-3
                    py-1.5
                    transition-all
                    duration-300
                    hover:border-[#A97849]
                    hover:bg-white
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#EEE4DA]
                      font-heading
                      text-sm
                      font-semibold
                      text-[#80634B]
                    "
                  >
                    {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>

                  <div className="hidden text-left xl:block">
                    <p
                      className="
                        font-manrope
                        text-[11px]
                        font-bold
                        leading-tight
                        text-[#40352E]
                      "
                    >
                      {userData?.name || "Account"}
                    </p>

                    <p
                      className="
                        mt-0.5
                        max-w-[130px]
                        truncate
                        font-manrope
                        text-[9px]
                        leading-tight
                        text-[#8A7A6D]
                      "
                    >
                      {userData?.email || ""}
                    </p>
                  </div>

                  <FiChevronDown
                    className={`
                      ml-1
                      text-xs
                      text-[#80634B]
                      transition-transform
                      duration-300

                      ${profileOpen ? "rotate-180" : ""}
                    `}
                  />
                </button>

                {/* =================================================
                    ACCOUNT DROPDOWN
                ================================================= */}

                {profileOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-[calc(100%+12px)]
                      w-64
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#E2D7CD]
                      bg-[#FCFAF7]
                      p-2
                      shadow-[0_20px_50px_rgba(54,40,30,0.12)]
                    "
                  >
                    <div
                      className="
                        border-b
                        border-[#E8DED5]
                        px-3
                        py-3
                      "
                    >
                      <p
                        className="
                          font-heading
                          text-base
                          font-semibold
                          text-[#332922]
                        "
                      >
                        {userData?.name || "User"}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          font-manrope
                          text-[11px]
                          text-[#8A7A6D]
                        "
                      >
                        {userData?.email || "No email available"}
                      </p>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="
                        mt-1
                        flex
                        items-center
                        rounded-xl
                        px-3
                        py-3
                        font-manrope
                        text-sm
                        font-semibold
                        text-[#55483F]
                        transition-colors
                        hover:bg-[#F0E8E0]
                      "
                    >
                      My Orders
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        py-3
                        font-manrope
                        text-left
                        text-sm
                        font-semibold
                        text-[#55483F]
                        transition-colors
                        hover:bg-[#F0E8E0]
                      "
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="
                  hidden
                  items-center
                  gap-2
                  font-manrope
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#55483F]
                  transition-colors
                  duration-300
                  hover:text-[#A97849]
                  sm:flex
                "
              >
                <FiUser className="text-sm" />
                Login
              </button>
            )}

            {/* ===================================================
                NOTIFICATIONS
            =================================================== */}

            {/* ===================================================
    NOTIFICATIONS
=================================================== */}

            {token && (
              <div
                ref={notificationRef}
                className="
      relative
      z-[60]
    "
              >
                <button
                  type="button"
                  onClick={toggleNotifications}
                  className="
        group
        relative
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-[#DCCFC3]
        bg-white/50
        text-[#594A40]
        transition-all
        duration-300

        hover:border-[#A97849]
        hover:bg-[#A97849]
        hover:text-white

        sm:h-11
        sm:w-11
      "
                  aria-label="Notifications"
                >
                  <FiBell
                    className="
          text-[17px]
          transition-transform
          duration-300
          group-hover:-translate-y-0.5
        "
                  />

                  {unreadCount > 0 && (
                    <span
                      className="
            absolute
            -right-1
            -top-1
            flex
            h-[18px]
            min-w-[18px]
            items-center
            justify-center
            rounded-full
            bg-[#A97849]
            px-1
            font-manrope
            text-[8px]
            font-bold
            text-white
            ring-2
            ring-[#FCFAF7]
          "
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div
                    className="
          absolute
          top-[calc(100%+12px)]
          
          /* Mobile */
          right-[-52px]
          w-[calc(100vw-24px)]
          max-w-[380px]

          /* Small screens */
          sm:right-[-10px]
          sm:w-[380px]

          /* Large screens */
          lg:right-0

          z-[100]
        "
                  >
                    <Notification
                      notifications={notifications}
                      onClose={() => setNotificationOpen(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ===================================================
                CART
            =================================================== */}

            <Link
              to="/cart"
              className="
                group
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#DCCFC3]
                bg-white/50
                text-[#594A40]
                transition-all
                duration-300
                hover:border-[#A97849]
                hover:bg-[#A97849]
                hover:text-white

                sm:h-11
                sm:w-11
              "
            >
              <FiShoppingBag
                className="
                  text-[17px]
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                "
              />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-[18px]
                    min-w-[18px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#A97849]
                    px-1
                    font-manrope
                    text-[8px]
                    font-bold
                    text-white
                    ring-2
                    ring-[#FCFAF7]
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ===================================================
                MOBILE MENU
            =================================================== */}

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#DCCFC3]
                text-[#594A40]
                transition-all
                duration-300
                hover:border-[#A97849]
                hover:bg-[#A97849]
                hover:text-white
                lg:hidden
              "
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <FiX className="text-lg" />
              ) : (
                <FiMenu className="text-lg" />
              )}
            </button>
          </div>
        </div>

        {/* =========================================================
            MOBILE MENU
        ========================================================= */}

        <div
          className={`
            overflow-hidden
            border-t
            border-[#E5DCD4]
            bg-[#FCFAF7]/98
            transition-all
            duration-500
            lg:hidden

            ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-5 pb-6 pt-3 sm:px-8">
            <nav className="flex flex-col">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  className={({ isActive }) => `
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#E8DED5]
                    py-4
                    font-heading
                    text-lg
                    transition-colors
                    duration-300

                    ${
                      isActive
                        ? "text-[#A97849]"
                        : "text-[#40352E] hover:text-[#A97849]"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.name}</span>

                      <span
                        className={`
                          font-manrope
                          text-[9px]
                          tracking-[0.2em]
                          ${isActive ? "opacity-100" : "opacity-30"}
                        `}
                      >
                        0{index + 1}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Mobile account */}

            <div className="mt-5">
              {token ? (
                <>
                  <div
                    className="
                      mb-3
                      rounded-xl
                      border
                      border-[#E0D5CB]
                      bg-[#F5EFE9]
                      px-4
                      py-3
                    "
                  >
                    <p
                      className="
                        font-heading
                        text-base
                        font-semibold
                        text-[#332922]
                      "
                    >
                      {userData?.name || "User"}
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        font-manrope
                        text-[11px]
                        font-medium
                        text-[#8A7A6D]
                      "
                    >
                      {userData?.email || ""}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to="/orders"
                      onClick={closeMobile}
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[#D7CABE]
                        py-3
                        font-manrope
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.1em]
                        text-[#594A40]
                      "
                    >
                      <FiShoppingBag />
                      My Orders
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        closeMobile();
                      }}
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#40352E]
                        py-3
                        font-manrope
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.1em]
                        text-white
                      "
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(true);
                    closeMobile();
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#A97849]
                    py-3.5
                    font-manrope
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-white
                  "
                >
                  <FiUser />
                  Login to Account
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          NAVBAR SPACER
      ========================================================= */}

      <div className="h-[76px] sm:h-[82px]" />
    </>
  );
};

export default Navbar;
