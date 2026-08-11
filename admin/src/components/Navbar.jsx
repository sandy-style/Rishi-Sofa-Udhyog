import React from "react";
import logo from "../assets/logo.svg";
import { FiLogOut } from "react-icons/fi";

const Navbar = ({ setToken }) => {
  const handleLog = () => {
    setToken("");
    localStorage.setItem("token", "");
  };
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-20 items-center justify-between px-8">
        {/* Logo */}

        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 object-contain" />

          <div>
            <h1 className="text-xl font-bold text-gray-800">RSU Admin</h1>

            <p className="text-sm text-gray-500">Furniture Management</p>
          </div>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-6">
          {/* Admin */}

          <div className="hidden md:flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white font-semibold">
              A
            </div>

            <div>
              <p className="font-semibold text-gray-800">Admin</p>

              <p className="text-sm text-gray-500">administrator</p>
            </div>
          </div>

          {/* Logout */}

          <button
            onClick={handleLog}
            className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-red-500 hover:text-white hover:border-red-500"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
