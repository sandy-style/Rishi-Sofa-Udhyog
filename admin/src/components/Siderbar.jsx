import React from "react";
import { NavLink } from "react-router-dom";
import { MdAddBox } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
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
  ];

  return (
    <aside className="h-full w-16 sm:w-20 md:w-64 bg-white border-r">
      {/* Header */}
      <div className="border-b px-2 sm:px-3 md:px-6 py-5">
        <h2 className="hidden md:block text-xl font-bold text-gray-800">
          Dashboard
        </h2>

        <p className="hidden md:block text-sm text-gray-500">Admin Panel</p>

        {/* Mobile icon */}
        <div className="md:hidden flex justify-center">
          <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-bold">
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

            <span className="hidden md:block font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Siderbar;
