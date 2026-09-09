import React from "react";
import { NavLink } from "react-router-dom";
import { MdAddBox } from "react-icons/md";
import { FaClipboardList, FaStar } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";

const Siderbar = () => {
  const menu = [
    {
      name: "Add Product",
      path: "/",
      icon: <MdAddBox size={22} />,
    },
    {
      name: "Product List",
      path: "/list",
      icon: <FaClipboardList size={20} />,
    },
    {
      name: "Orders",
      path: "/order",
      icon: <BsBoxSeam size={20} />,
    },
    {
      name: "Reviews",
      path: "/review",
      icon: <FaStar size={20} />,
    },
  ];

  return (
    <aside className="h-full w-16 border-r bg-white sm:w-20 md:w-64">
      {/* Header */}
      <div className="border-b px-2 py-5 sm:px-3 md:px-6">
        <h2 className="hidden text-xl font-bold text-gray-800 md:block">
          Dashboard
        </h2>

        <p className="hidden text-sm text-gray-500 md:block">Admin Panel</p>

        {/* Mobile icon */}
        <div className="flex justify-center md:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black font-bold text-white">
            A
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-col gap-2 px-2 md:px-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={item.name}
            className={({ isActive }) =>
              `flex items-center rounded-xl py-3 transition-all duration-200
              justify-center md:justify-start
              gap-0 md:gap-4
              px-2 md:px-4
              ${
                isActive
                  ? "bg-black text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}

            <span className="hidden font-medium md:block">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Siderbar;
