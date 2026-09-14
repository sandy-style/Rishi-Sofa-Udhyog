import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { FiLogOut, FiBell } from "react-icons/fi";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setToken, token }) => {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLog = () => {
    setToken("");
    localStorage.setItem("token", "");
    setNotifications([]);
    setUnreadCount(0);
    setShowNotifications(false);
  };

  // ============================================================
  // GET UNREAD NOTIFICATION COUNT
  // ============================================================

  const getUnreadCount = async () => {
    try {
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await axios.get(
        backendUrl + "/api/notification/admin-unread-count",
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (error) {
      console.log(
        "GET ADMIN UNREAD COUNT ERROR:",
        error.response?.data || error.message,
      );
    }
  };

  // ============================================================
  // GET ADMIN NOTIFICATIONS
  // ============================================================

  const getNotifications = async () => {
    try {
      if (!token) {
        setNotifications([]);
        return;
      }

      const response = await axios.get(
        backendUrl + "/api/notification/admin-list",
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.log(
        "GET ADMIN NOTIFICATIONS ERROR:",
        error.response?.data || error.message,
      );
    }
  };

  // ============================================================
  // MARK ADMIN NOTIFICATION AS READ
  // ============================================================

  const markAsRead = async (notificationId) => {
    try {
      if (!token || !notificationId) {
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/notification/admin-read",
        {
          notificationId,
        },
        {
          headers: {
            token,
          },
        },
      );

      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification,
          ),
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.log(
        "MARK ADMIN NOTIFICATION READ ERROR:",
        error.response?.data || error.message,
      );
    }
  };

  // ============================================================
  // LOAD UNREAD COUNT
  // ============================================================

  useEffect(() => {
    if (!token) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    getUnreadCount();

    const interval = setInterval(() => {
      getUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  // ============================================================
  // NOTIFICATION BELL
  // ============================================================

  const notificationHandler = async () => {
    const newState = !showNotifications;

    setShowNotifications(newState);

    if (newState) {
      await getNotifications();
      await getUnreadCount();
    }
  };

  // ============================================================
  // VIEW NOTIFICATION
  // ============================================================

  const handleNotificationClick = async (notification) => {
    if (!notification) {
      return;
    }

    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    setShowNotifications(false);

    if (notification.orderId) {
      navigate("/order/" + notification.orderId);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex min-h-16 items-center justify-between gap-3 px-3 py-3 sm:min-h-20 sm:px-5 md:px-8">
        {/* Logo */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <img
            src={logo}
            alt="Logo"
            className="h-9 w-auto object-contain sm:h-12"
          />

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-gray-800 sm:text-xl">
              RSU Admin
            </h1>

            <p className="hidden text-sm text-gray-500 sm:block">
              Furniture Management
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={notificationHandler}
              className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
              aria-label="Notifications"
            >
              <FiBell size={22} className="sm:h-6 sm:w-6" />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white sm:text-xs">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-50
                  mt-3
                  w-[calc(100vw-16px)]
                  max-w-96
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  shadow-xl
                "
              >
                {/* Header */}
                <div className="border-b px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <span className="text-xs font-medium text-gray-500">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                </div>

                {/* Notifications */}
                <div className="max-h-[70vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`border-b px-3 py-3 transition sm:px-4 ${
                          notification.isRead ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Notification Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                              )}

                              <p
                                className={`truncate text-sm ${
                                  notification.isRead
                                    ? "font-medium"
                                    : "font-bold"
                                } text-gray-800`}
                              >
                                {notification.title}
                              </p>
                            </div>

                            <p className="mt-1 text-sm leading-5 text-gray-500">
                              {notification.message}
                            </p>

                            {notification.createdAt && (
                              <p className="mt-1 text-xs text-gray-400">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>

                          {/* View Order Button */}
                          {notification.orderId && (
                            <button
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white transition sm:px-3 ${
                                notification.isRead
                                  ? "bg-gray-600 hover:bg-gray-700"
                                  : "bg-black hover:bg-gray-800"
                              }`}
                            >
                              {notification.isRead ? "Review" : "View"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-semibold text-white">
              A
            </div>

            <div>
              <p className="font-semibold text-gray-800">Admin</p>

              <p className="text-sm text-gray-500">administrator</p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLog}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-300
              px-3
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:border-red-500
              hover:bg-red-500
              hover:text-white
              sm:px-5
              sm:text-base
            "
          >
            <FiLogOut size={17} />

            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
