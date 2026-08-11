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
    <aside className="h-full w-64 bg-white">
      <div className="border-b px-6 py-5">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>

        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200
              ${
                isActive
                  ? "bg-black text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}

            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Siderbar;
