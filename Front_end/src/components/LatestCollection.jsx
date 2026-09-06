import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/shopContext";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Title from "./Title";
import ProductCard from "./ProductCard";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  const [latest, setLatest] = useState([]);

  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);

  // =========================
  // GET LATEST PRODUCTS
  // =========================
  useEffect(() => {
    if (!products || products.length === 0) {
      setLatest([]);
      return;
    }

    setLatest(products.slice(0, 5));
  }, [products]);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || latest.length === 0) return;

    let lastTime = performance.now();

    // Smaller = slower
    const speed = 0.07;

    const animate = (currentTime) => {
      const delta = Math.min(currentTime - lastTime, 32);

      lastTime = currentTime;

      if (!pausedRef.current) {
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        if (maxScroll > 0) {
          slider.scrollLeft += delta * speed;

          // Reached the end
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
  }, [latest]);

  // =========================
  // PAUSE / RESUME
  // =========================
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
    pausedRef.current = false;
  };

  // =========================
  // GET CARD WIDTH
  // =========================
  const getCardWidth = () => {
    const slider = sliderRef.current;

    if (!slider) return 0;

    const card = slider.querySelector("[data-product-card]");

    if (!card) return 0;

    const styles = window.getComputedStyle(slider);

    const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;

    return card.offsetWidth + gap;
  };

  // =========================
  // PREVIOUS
  // =========================
  const handlePrevious = () => {
    const slider = sliderRef.current;

    if (!slider) return;

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

  // =========================
  // NEXT
  // =========================
  const handleNext = () => {
    const slider = sliderRef.current;

    if (!slider) return;

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

  // =========================
  // PRODUCT CARD
  // =========================
  const renderProduct = (item, index) => (
    <div
      key={item._id || index}
      data-product-card
      className="
        shrink-0
        min-w-[82%]

        sm:min-w-[47%]

        md:min-w-[31.5%]

        lg:min-w-[calc(25%-18px)]
      "
    >
      <ProductCard
        id={item._id}
        image={item.image?.[0]}
        name={item.name}
        price={item.price}
        description={item.description}
      />
    </div>
  );

  // =========================
  // VIEW MORE
  // =========================
  const renderViewMore = () => (
    <button
      type="button"
      onClick={() => navigate("/collection")}
      className="
        group
        flex
        shrink-0
        min-w-[82%]
        items-center
        justify-center
        rounded-2xl
        border
        border-[#D8C9B8]
        bg-[#FBF8F4]
        px-6
        transition-all
        duration-500

        hover:-translate-y-1
        hover:border-[#6A4E3B]
        hover:bg-[#F2E5D6]
        hover:shadow-[0_20px_45px_rgba(115,82,45,0.14)]

        sm:min-w-[47%]
        sm:rounded-[26px]

        md:min-w-[31.5%]

        lg:min-w-[calc(25%-18px)]
        lg:rounded-[30px]
      "
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="
            mb-5
            flex
            h-14
            w-14
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

            sm:h-16
            sm:w-16
          "
        >
          <FiArrowRight className="text-xl sm:text-2xl" />
        </div>

        <h3
          className="
            font-serif
            text-lg
            text-[#3B2B20]

            sm:text-xl
          "
        >
          View More
        </h3>

        <p
          className="
            mt-2
            max-w-[190px]
            text-xs
            leading-5
            text-[#806F62]
          "
        >
          Explore our latest sofa collection
        </p>
      </div>
    </button>
  );

  // =========================
  // NO PRODUCTS
  // =========================
  if (!latest.length) return null;

  return (
    <section className="my-12 sm:my-16 lg:my-20">
      <div className="mx-auto max-w-[1550px]">
        {/* =========================
            HEADER
        ========================= */}
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
          {/* TITLE */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
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
        font-medium
        uppercase
        tracking-[0.28em]
        text-[#8A6B50]

        sm:text-[11px]
      "
              >
                Latest Collection
              </span>

              <span className="h-px w-10 bg-[#C8A77F]" />
            </div>

            {/* Main Title */}
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
              Freshly Crafted,
              <br className="hidden sm:block" />
              <span className="text-[#8A6B50]"> Made for Living</span>
            </h2>

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
              Experience our newest sofa designs, combining premium quality,
              elegant craftsmanship, and unmatched comfort to elevate every
              living space with style.
            </p>
          </div>

          {/* =========================
              ARROWS
          ========================= */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={handlePrevious}
              className="
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
              <FiArrowLeft className="text-lg" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="
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
              <FiArrowRight className="text-lg" />
            </button>
          </div>
        </div>

        {/* =========================
            ONE ROW ONLY
        ========================= */}
        <div
          ref={sliderRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="
            latest-collection-slider
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
          {/* PRODUCTS */}
          {latest.map((item, index) => renderProduct(item, index))}

          {/* VIEW MORE */}
          {renderViewMore()}
        </div>

        {/* =========================
            MOBILE SWIPE TEXT
        ========================= */}
        <div
          className="
            mt-2
            flex
            items-center
            justify-center
            gap-2
            text-[10px]
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
      </div>

      {/* =========================
          HIDE SCROLLBAR
      ========================= */}
      <style>
        {`
          .latest-collection-slider::-webkit-scrollbar {
            display: none;
          }

          .latest-collection-slider {
            scrollbar-width: none;
            -ms-overflow-style: none;
            scroll-behavior: auto;
          }
        `}
      </style>
    </section>
  );
};

export default LatestCollection;
