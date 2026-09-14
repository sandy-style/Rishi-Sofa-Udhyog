import React from "react";
import {
  FiBell,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";

const Notification = ({ notifications = [], onClose }) => {
  // ================= NOTIFICATION ICON =================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "out_for_delivery":
        return <FiTruck />;

      case "delivered":
        return <FiCheckCircle />;

      case "new_order":
        return <FiShoppingBag />;

      case "new_product":
        return <FiPackage />;

      default:
        return <FiBell />;
    }
  };

  // ================= FORMAT DATE =================

  const formatDate = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();

    const difference = now - notificationDate;

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  return (
    <div
      className="
        fixed
        left-3
        right-3
        top-[72px]
        z-[100]
        w-auto

        overflow-hidden
        rounded-2xl
        border
        border-[#E5DDD3]
        bg-[#FBF8F4]
        shadow-[0_15px_45px_rgba(59,43,32,0.15)]

        sm:absolute
        sm:left-auto
        sm:right-0
        sm:top-full
        sm:mt-3
        sm:w-[380px]
        sm:max-w-[380px]
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#E5DDD3]
          px-4
          py-3.5

          sm:px-5
          sm:py-4
        "
      >
        <div className="min-w-0">
          <h3
            className="
              font-serif
              text-base
              font-semibold
              text-[#3B2B20]

              sm:text-lg
            "
          >
            Notifications
          </h3>

          <p
            className="
              mt-0.5
              text-[10px]
              text-[#7E746D]

              sm:text-xs
            "
          >
            Stay updated with your orders
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="
              ml-3
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[#7E746D]
              transition

              hover:bg-[#F0EBE5]
              hover:text-[#3B2B20]

              active:scale-95
            "
            aria-label="Close notifications"
          >
            <FiX size={17} />
          </button>
        )}
      </div>

      {/* ======================================================
          NOTIFICATION LIST
      ====================================================== */}

      <div
        className="
          notification-list
          max-h-[calc(100vh-110px)]
          overflow-y-auto

          sm:max-h-[390px]
        "
      >
        {notifications.length === 0 ? (
          /* ================= EMPTY STATE ================= */

          <div
            className="
              flex
              min-h-[220px]
              flex-col
              items-center
              justify-center
              px-5
              py-8
              text-center

              sm:min-h-[300px]
              sm:px-8
            "
          >
            <div
              className="
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-[#F0EBE5]
                text-[#B07B45]

                sm:h-14
                sm:w-14
              "
            >
              <FiBell size={22} className="sm:hidden" />
              <FiBell size={24} className="hidden sm:block" />
            </div>

            <h4
              className="
                text-xs
                font-semibold
                text-[#3B2B20]

                sm:text-sm
              "
            >
              No notifications yet
            </h4>

            <p
              className="
                mt-1
                max-w-[230px]
                text-[10px]
                leading-5
                text-[#7E746D]

                sm:max-w-[250px]
                sm:text-xs
              "
            >
              We'll let you know about your orders and our latest furniture.
            </p>
          </div>
        ) : (
          /* ================= NOTIFICATIONS ================= */

          notifications.map((notification) => (
            <button
              key={notification._id}
              type="button"
              className={`
                flex
                w-full
                gap-2.5
                border-b
                border-[#E5DDD3]
                px-3.5
                py-3.5
                text-left
                transition

                hover:bg-[#F5F0EA]

                sm:gap-3
                sm:px-5
                sm:py-4

                ${!notification.isRead ? "bg-[#F5F0EA]" : "bg-transparent"}
              `}
            >
              {/* ================= ICON ================= */}

              <div
                className={`
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full

                  sm:h-10
                  sm:w-10

                  ${
                    notification.isRead
                      ? "bg-[#F0EBE5] text-[#7E746D]"
                      : "bg-[#F2E5D6] text-[#B07B45]"
                  }
                `}
              >
                <span className="text-sm sm:text-base">
                  {getNotificationIcon(notification.type)}
                </span>
              </div>

              {/* ================= CONTENT ================= */}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={`
                      min-w-0
                      flex-1
                      break-words
                      text-xs
                      leading-4

                      sm:text-sm
                      sm:leading-5

                      ${
                        notification.isRead
                          ? "font-medium text-[#3B2B20]"
                          : "font-semibold text-[#3B2B20]"
                      }
                    `}
                  >
                    {notification.title}
                  </h4>

                  {!notification.isRead && (
                    <span
                      className="
                        mt-1
                        h-2
                        w-2
                        shrink-0
                        rounded-full
                        bg-[#B07B45]
                      "
                    />
                  )}
                </div>

                <p
                  className="
                    mt-1
                    line-clamp-2
                    break-words
                    text-[10px]
                    leading-4
                    text-[#7E746D]

                    sm:text-xs
                    sm:leading-5
                  "
                >
                  {notification.message}
                </p>

                <p
                  className="
                    mt-1.5
                    text-[9px]
                    font-medium
                    text-[#A0958C]

                    sm:mt-2
                    sm:text-[10px]
                  "
                >
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* ======================================================
          SCROLLBAR
      ====================================================== */}

      <style>
        {`
          .notification-list::-webkit-scrollbar {
            width: 5px;
          }

          .notification-list::-webkit-scrollbar-track {
            background: transparent;
          }

          .notification-list::-webkit-scrollbar-thumb {
            background: #D8C9B8;
            border-radius: 999px;
          }
        `}
      </style>
    </div>
  );
};

export default Notification;
