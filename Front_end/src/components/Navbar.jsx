import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/shopContext";

const Navbar = ({ setToken, setShowLogin, token }) => {
  const location = useLocation();
  const [menu, showMenu] = useState(false);
  const { setShowSearch, showSearch, getCartCount, navigate } =
    useContext(ShopContext);
  return (
    <div className="flex items-center justify-between md:justify-between px-2 gap-3 md:px-12 font-manrope">
      <img
        onClick={() => navigate("/")}
        className="w-13 md:w-23"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden sm:flex gap-5 uppercase text-sm text-[#2C2926]">
        <NavLink
          to="/"
          className="flex flex-col items-center  hover:text-[#B8864C] gap-1"
        >
          <p>Home</p>
          <hr className="border-none w-2/4 h-[1.5px] hidden bg-gray-600 opacity-0" />
        </NavLink>
        <NavLink
          to="/collection"
          className="flex flex-col items-center gap-1  hover:text-[#B8864C]"
        >
          <p>Collection</p>
          <hr className="border-none w-2/4 h-[1.5px] hidden bg-gray-600 opacity-0" />
        </NavLink>{" "}
        <NavLink
          to="/about"
          className="flex flex-col items-center gap-1  hover:text-[#B8864C]"
        >
          <p>About</p>
          <hr className="border-none w-2/4 h-[1.5px] hidden bg-gray-600 opacity-0  hover:text-[#B8864C]" />
        </NavLink>
        <NavLink
          to="/contact"
          className="flex flex-col items-center gap-1  hover:text-[#B8864C]"
        >
          <p>Contact</p>
          <hr className="border-none w-2/4 h-[1.5px] hidden bg-gray-600 opacity-0" />
        </NavLink>
      </ul>
      {/* Menu  start */}

      <div
        className={` ${menu ? "block" : "hidden"} sm:hidden fixed top-0 right-0 w-72 h-screen bg-[#F7F3EE] shadow-2xl z-50 flex flex-col px-8 py-10`}
      >
        <button
          onClick={() => showMenu(false)}
          className="self-end text-3xl mb-10 cursor-pointer"
        >
          &times;
        </button>

        <nav className="flex flex-col gap-8 uppercase tracking-widest text-[#231F1C] text-lg">
          <NavLink
            onClick={() => showMenu(false)}
            to="/"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? "text-[#C99658] font-semibold"
                  : "text-[#231F1C] hover:text-[#C99658]"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            onClick={() => showMenu(false)}
            to="/collection"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? "text-[#C99658] font-semibold"
                  : "text-[#231F1C] hover:text-[#C99658]"
              }`
            }
          >
            Collection
          </NavLink>

          <NavLink
            onClick={() => showMenu(false)}
            to="/about"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? "text-[#C99658] font-semibold"
                  : "text-[#231F1C] hover:text-[#C99658]"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            onClick={() => showMenu(false)}
            to="/contact"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? "text-[#C99658] font-semibold"
                  : "text-[#231F1C] hover:text-[#C99658]"
              }`
            }
          >
            Contact
          </NavLink>

          <NavLink onClick={() => showMenu(false)} to="/login">
            <button className="mt-6 w-full bg-[#C99658] text-white py-3 rounded-xl hover:bg-[#B8864C] transition">
              Sign In
            </button>
          </NavLink>
        </nav>
      </div>

      {/* Menu end */}

      <div className="flex justify-end gap-6 items-center">
        <div
          className={`${location.pathname === "/collection" ? "block " : "hidden"}    flex items-center justify-center py-3 px-2`}
        >
          <img
            onClick={() => setShowSearch(!showSearch)}
            src={assets.search_icon}
            className="w-8"
            alt=""
          />
        </div>
        <NavLink
          className={({ isActive }) => `${isActive ? "hidden" : "relative"}`}
          to="/cart"
        >
          <div className="relative">
            <p className="absolute  right-[-5px] text-center w-4 leading-4 bottom-[-5px] bg-black text-white rounded-full aspect-square text-[8px]">
              {getCartCount()}
            </p>{" "}
            <img className="w-8" src={assets.cart_icon} alt="" />
          </div>
        </NavLink>
        <div>
          {!token ? (
            <button
              onClick={() => setShowLogin(true)}
              className="w-36 hidden sm:block cursor-pointer md:rounded-2xl hover:bg-orange-50 hover:text-black  bg-black text-white px-2 py-2 text-sm rounded-xs"
            >
              Sign In / Register
            </button>
          ) : (
            <button
              onClick={() => setToken("")}
              className="w-36 hidden sm:block cursor-pointer md:rounded-2xl hover:bg-orange-50 hover:text-black  bg-black text-white px-2 py-2 text-sm rounded-xs"
            >
              Log out
            </button>
          )}
        </div>
        <img
          className="sm:hidden block w-6 "
          onClick={() => showMenu(true)}
          src={assets.menu_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default Navbar;
