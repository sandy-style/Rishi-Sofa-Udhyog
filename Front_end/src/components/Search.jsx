import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/shopContext";

const Search = () => {
  const { showSearch, setSearch } = useContext(ShopContext);
  return (
    <div
      className={`${showSearch ? "block" : "hidden"} w-full flex justify-center py-8`}
    >
      <div className="w-full max-w-xl flex items-center border border-gray-300 rounded-full px-5 py-3 bg-white shadow-sm">
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search for sofas..."
          className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
        />

        <button className="ml-3">
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-5 h-5 opacity-70 hover:opacity-100 transition"
          />
        </button>
      </div>
    </div>
  );
};

export default Search;
