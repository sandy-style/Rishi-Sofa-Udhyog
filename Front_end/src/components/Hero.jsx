import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <div className="border border-orange-300 flex flex-col sm:flex-row bg-[#F0EBE5] font-manrope  shadow-lg ">
      <div className="w-full sm:w-1/2 flex flex-col  justify-center pl-8  gap-10">
        <div className="  flex items-center ">
          <h1 className="text-5xl md:text-7xl font-heading leading-tight font-light text-[#231F1C]">
            {" "}
            Elevate Your <br />
            Living Space
          </h1>
        </div>{" "}
        <div className=" flex items-center ">
          <p className="text-xs md:text-base text-[#6D655D] font-manrope  uppercase">
            {" "}
            Crafted for modern homes with comfort, elegance,
            <br /> and timeless design.
          </p>
        </div>
        <div className="flex justify-between items-center md:justify-normal md:gap-6 px-10 sm:px-3 sm:py-2 py-5">
          <Link to="/collection">
            <button className="bg-[#eaac60] flex items-center justify-center  px-1 py-1 md:px-3 md:py-3  uppercase text-xs cursor-pointer md:text-base lg:text-xl  text-black hover:text-[#FFFFFF] shadow-amber-400 md:rounded-xl hover:bg-[#9a672e] transition-colors ease-in 0.5s rounded-xs    ">
              explore collections
              <img className="w-4  " src={assets.arrow_icon} alt="" />{" "}
            </button>
          </Link>
          <Link to="/about">
            <button className="flex items-center justify-center px-1 py-1 md:px-3 md:py-3 uppercase text-xs md:text-base lg:text-xl  bg-transparent border border-[#8A8178] text-[#2D2926]  hover:bg-[#231F1C] hover:text-[#FFFFFF] transition-all ease-in 0.5s rounded-xs md:rounded-xl cursor-pointer">
              {" "}
              Our Story{" "}
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full sm:w-1/2 ">
        <img src={assets.hero} className="h-full" alt="" />
      </div>
    </div>
  );
};

export default Hero;
