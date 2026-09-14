import React, { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

import Hero from "../components/Hero";
import BestSellers from "../components/BestSellers";
import LatestCollection from "../components/LatestCollection";
import Almirah from "../components/Almirah";
import Beds from "../components/Beds";
import TablesTvunits from "../components/TablesTvunits";
import Sofa from "../components/Sofa";
import CustomerReviews from "../components/CustomerReviews";

const Home = () => {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* ================= HERO ================= */}

      <Hero />

      {/* ================= BEST SELLERS ================= */}

      <BestSellers />

      {/* ================= LATEST COLLECTION ================= */}

      <LatestCollection />

      <Sofa />
      <Almirah />

      <Beds />

      <TablesTvunits />

      <CustomerReviews />
      {/* ================= GO TO TOP ================= */}

      <button
        type="button"
        onClick={goToTop}
        aria-label="Go to top"
        className={`
          group
          fixed
          bottom-6
          right-5
          z-50
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-[#D8C9B8]
          bg-[#FBF8F4]/95
          text-[#6A4E3B]
          shadow-[0_8px_25px_rgba(74,55,40,0.15)]
          backdrop-blur-md
          transition-all
          duration-500
          
          sm:bottom-8
          sm:right-8
          sm:h-12
          sm:w-12

          hover:-translate-y-1
          hover:border-[#6A4E3B]
          hover:bg-[#6A4E3B]
          hover:text-white

          ${
            showTopButton
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-5 opacity-0"
          }
        `}
      >
        <FiArrowUp
          className="
            text-base
            transition-transform
            duration-300
            group-hover:-translate-y-0.5
            sm:text-lg
          "
        />
      </button>
    </div>
  );
};

export default Home;
