import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/shopContext";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import ProductCard from "./ProductCard";

const TablesTvunits = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);

  // ================= TABLE + TV UNIT PRODUCTS =================

  useEffect(() => {
    if (!products || products.length === 0) {
      setItems([]);
      return;
    }

    const filteredProducts = products
      .filter((item) => {
        const category = String(item?.category || item?.productCategory || "")
          .trim()
          .toLowerCase();

        return (
          category === "table" ||
          category === "tables" ||
          category === "tv-unit" ||
          category === "tv-units" ||
          category === "tvunit" ||
          category === "tvunits"
        );
      })
      .slice(0, 8);

    setItems(filteredProducts);
  }, [products]);

  // ================= AUTO SLIDER =================

  useEffect(() => {
    const slider = sliderRef.current;

    // Don't auto-scroll when there aren't enough products
    if (!slider || items.length < 3) return;

    let lastTime = performance.now();

    const speed = 0.055;

    const animate = (currentTime) => {
      const delta = Math.min(currentTime - lastTime, 32);

      lastTime = currentTime;

      if (!pausedRef.current) {
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        if (maxScroll > 0) {
          slider.scrollLeft += delta * speed;

          if (slider.scrollLeft >= maxScroll - 1) {
            slider.scrollLeft = 0;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [items]);

  // ================= PAUSE CONTROLS =================

  const handleMouseEnter = () => {
    pausedRef.current = true;
  };

  const handleMouseLeave = () => {
    pausedRef.current = false;
  };

  const handleTouchStart = () => {
    pausedRef.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      pausedRef.current = false;
    }, 500);
  };

  // ================= CARD WIDTH =================

  const getCardWidth = () => {
    const slider = sliderRef.current;

    if (!slider) return 0;

    const card = slider.querySelector("[data-product-card]");

    if (!card) return 0;

    const styles = window.getComputedStyle(slider);

    const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

    return card.offsetWidth + gap;
  };

  // ================= PREVIOUS =================

  const handlePrevious = () => {
    const slider = sliderRef.current;

    if (!slider || items.length < 3) return;

    const cardWidth = getCardWidth();

    if (!cardWidth) return;

    pausedRef.current = true;

    slider.scrollBy({
      left: -cardWidth,
      behavior: "smooth",
    });

    setTimeout(() => {
      pausedRef.current = false;
    }, 700);
  };

  // ================= NEXT =================

  const handleNext = () => {
    const slider = sliderRef.current;

    if (!slider || items.length < 3) return;

    const cardWidth = getCardWidth();

    if (!cardWidth) return;

    pausedRef.current = true;

    slider.scrollBy({
      left: cardWidth,
      behavior: "smooth",
    });

    setTimeout(() => {
      pausedRef.current = false;
    }, 700);
  };

  // ================= CARD WIDTH =================

  const getProductCardClass = () => {
    // One product
    if (items.length === 1) {
      return `
        shrink-0
        w-[82%]
        sm:w-[48%]
        md:w-[32%]
        lg:w-[calc(25%-18px)]
      `;
    }

    // Two products
    if (items.length === 2) {
      return `
        shrink-0
        w-[82%]
        sm:w-[47%]
        md:w-[32%]
        lg:w-[calc(25%-18px)]
      `;
    }

    // Three or more products
    return `
      shrink-0
      w-[78%]
      sm:w-[47%]
      md:w-[31.5%]
      lg:w-[calc(25%-18px)]
    `;
  };

  // ================= PRODUCT CARD =================

  const renderProduct = (item, index) => (
    <div
      key={item._id || index}
      data-product-card
      className={getProductCardClass()}
    >
      <ProductCard
        id={item._id}
        image={item.image?.[0]}
        name={item.name}
        price={item.price}
        description={item.description}
        offer={item.offer}
        stock={item.stock}
        bestSeller={Number(item.soldCount || 0) > 0}
        category={item.category}
      />
    </div>
  );

  // ================= VIEW MORE CARD =================

  const renderViewMore = () => (
    <div
      className={`
        shrink-0
        flex
        gap-3
        w-[82%]
        sm:w-[47%]
        md:w-[31.5%]
        lg:w-[calc(25%-18px)]
      `}
    >
      {/* ================= TABLES ================= */}

      <button
        type="button"
        onClick={() => navigate("/collection?category=Tables")}
        className="
          group
          flex
          min-w-0
          flex-1
          items-center
          justify-center
          rounded-2xl
          border
          border-[#D8C9B8]
          bg-[#FBF8F4]
          px-4
          py-8
          transition-all
          duration-500

          hover:-translate-y-1
          hover:border-[#6A4E3B]
          hover:bg-[#F2E5D6]
          hover:shadow-[0_20px_45px_rgba(115,82,45,0.14)]

          sm:rounded-[26px]
          sm:px-5
          sm:py-10

          lg:rounded-[30px]
        "
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#CDBEAE]
              text-[#6A4E3B]
              transition-all
              duration-300

              group-hover:scale-110
              group-hover:bg-[#6A4E3B]
              group-hover:text-white

              sm:mb-5
              sm:h-14
              sm:w-14

              lg:h-16
              lg:w-16
            "
          >
            <FiArrowRight
              className="
                text-lg
                transition-transform
                duration-300
                group-hover:translate-x-1

                sm:text-xl
                lg:text-2xl
              "
            />
          </div>

          <h3
            className="
              font-serif
              text-base
              font-medium
              leading-tight
              text-[#3B2B20]

              transition-transform
              duration-300
              group-hover:-translate-y-0.5

              sm:text-lg

              lg:text-xl
            "
          >
            Explore Tables
          </h3>

          <p
            className="
              mt-2
              max-w-[170px]
              text-[10px]
              leading-4
              text-[#806F62]

              sm:text-xs
              sm:leading-5
            "
          >
            Discover elegant tables crafted for modern living
          </p>
        </div>
      </button>

      {/* ================= TV UNITS ================= */}

      <button
        type="button"
        onClick={() => navigate("/collection?category=Tv-units")}
        className="
          group
          flex
          min-w-0
          flex-1
          items-center
          justify-center
          rounded-2xl
          border
          border-[#D8C9B8]
          bg-[#FBF8F4]
          px-4
          py-8
          transition-all
          duration-500

          hover:-translate-y-1
          hover:border-[#6A4E3B]
          hover:bg-[#F2E5D6]
          hover:shadow-[0_20px_45px_rgba(115,82,45,0.14)]

          sm:rounded-[26px]
          sm:px-5
          sm:py-10

          lg:rounded-[30px]
        "
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#CDBEAE]
              text-[#6A4E3B]
              transition-all
              duration-300

              group-hover:scale-110
              group-hover:bg-[#6A4E3B]
              group-hover:text-white

              sm:mb-5
              sm:h-14
              sm:w-14

              lg:h-16
              lg:w-16
            "
          >
            <FiArrowRight
              className="
                text-lg
                transition-transform
                duration-300
                group-hover:translate-x-1

                sm:text-xl
                lg:text-2xl
              "
            />
          </div>

          <h3
            className="
              font-serif
              text-base
              font-medium
              leading-tight
              text-[#3B2B20]

              transition-transform
              duration-300
              group-hover:-translate-y-0.5

              sm:text-lg

              lg:text-xl
            "
          >
            Explore TV Units
          </h3>

          <p
            className="
              mt-2
              max-w-[170px]
              text-[10px]
              leading-4
              text-[#806F62]

              sm:text-xs
              sm:leading-5
            "
          >
            Find refined TV units for your entertainment space
          </p>
        </div>
      </button>
    </div>
  );

  // ================= EMPTY STATE =================

  if (!items.length) return null;

  return (
    <section className="my-12 sm:my-16 lg:my-20">
      <div className="mx-auto max-w-[1550px]">
        {/* ================= HEADER ================= */}

        <div
          className="
            mb-7
            flex
            flex-col
            gap-5
            px-4

            sm:mb-9
            sm:px-6

            lg:flex-row
            lg:items-end
            lg:justify-between
            lg:px-8

            xl:px-10
          "
        >
          <div className="text-center lg:text-left">
            {/* SECTION LABEL */}

            <div
              className="
                mb-3
                flex
                items-center
                justify-center
                gap-3

                lg:justify-start
              "
            >
              <span className="h-px w-10 bg-[#9A795B]" />

              <span
                className="
                  font-manrope
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#8A6B50]

                  sm:text-[11px]
                "
              >
                Tables & TV Units
              </span>

              <span className="h-px w-10 bg-[#C8A77F]" />
            </div>

            {/* HEADING */}

            <h2
              className="
                font-serif
                text-[30px]
                font-medium
                leading-[1.05]
                tracking-[-0.035em]
                text-[#2F241D]

                sm:text-[38px]

                lg:text-[44px]

                xl:text-[48px]
              "
            >
              Complete Your Space,
              <br className="hidden sm:block" />
              <span className="text-[#8A6B50]"> With Purposeful Design</span>
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-3
                max-w-2xl
                text-xs
                leading-5
                text-[#7E746D]

                sm:text-sm
                sm:leading-6

                lg:mx-0
                lg:text-base
              "
            >
              Discover beautifully designed tables and TV units that combine
              practical functionality with refined style for every modern home.
            </p>
          </div>

          {/* ================= DESKTOP ARROWS ================= */}

          {items.length >= 3 && (
            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                onClick={handlePrevious}
                className="
                  group
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D8C9B8]
                  bg-[#FBF8F4]
                  text-[#6A4E3B]
                  transition-all
                  duration-300

                  hover:border-[#6A4E3B]
                  hover:bg-[#6A4E3B]
                  hover:text-white
                  hover:shadow-md

                  xl:h-12
                  xl:w-12
                "
                aria-label="Previous products"
              >
                <FiArrowLeft
                  className="
                    text-lg
                    transition-transform
                    duration-300
                    group-hover:-translate-x-0.5
                  "
                />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="
                  group
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D8C9B8]
                  bg-[#FBF8F4]
                  text-[#6A4E3B]
                  transition-all
                  duration-300

                  hover:border-[#6A4E3B]
                  hover:bg-[#6A4E3B]
                  hover:text-white
                  hover:shadow-md

                  xl:h-12
                  xl:w-12
                "
                aria-label="Next products"
              >
                <FiArrowRight
                  className="
                    text-lg
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </button>
            </div>
          )}
        </div>

        {/* ================= PRODUCT SLIDER ================= */}

        <div
          ref={sliderRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="
            tables-tv-slider
            flex
            w-full
            gap-4
            overflow-x-auto
            px-4
            pb-5

            sm:gap-5
            sm:px-6

            lg:gap-6
            lg:px-8

            xl:px-10
          "
        >
          {items.map((item, index) => renderProduct(item, index))}

          {renderViewMore()}
        </div>

        {/* ================= MOBILE SWIPE HINT ================= */}

        {items.length >= 2 && (
          <div
            className="
              mt-2
              flex
              items-center
              justify-center
              gap-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-[#9A8068]

              lg:hidden
            "
          >
            <FiArrowLeft />

            <span>Swipe to explore</span>

            <FiArrowRight />
          </div>
        )}
      </div>

      {/* ================= SLIDER STYLING ================= */}

      <style>
        {`
          .tables-tv-slider::-webkit-scrollbar {
            display: none;
          }

          .tables-tv-slider {
            scrollbar-width: none;
            -ms-overflow-style: none;
            scroll-behavior: auto;
            -webkit-overflow-scrolling: touch;
          }
        `}
      </style>
    </section>
  );
};

export default TablesTvunits;
