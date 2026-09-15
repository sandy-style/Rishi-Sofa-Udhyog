  import React, { useContext, useEffect, useRef, useState } from "react";
  import { ShopContext } from "../context/shopContext";
  import { useNavigate } from "react-router-dom";
  import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
  import ProductCard from "./ProductCard";

  const BestSellers = () => {
    const { products } = useContext(ShopContext);
    const navigate = useNavigate();

    const [bestSeller, setBestSeller] = useState([]);

    const sliderRef = useRef(null);
    const animationRef = useRef(null);
    const pausedRef = useRef(false);

    // -----------------------------------------
    // GET BEST SELLERS
    // -----------------------------------------
    useEffect(() => {
      const bestProducts = [...(products || [])]
        .filter((item) => Number(item?.soldCount || 0) > 0)
        .sort((a, b) => Number(b?.soldCount || 0) - Number(a?.soldCount || 0))
        .slice(0, 8);

      setBestSeller(bestProducts);
    }, [products]);

    // -----------------------------------------
    // AUTO SLIDER
    // -----------------------------------------
    useEffect(() => {
      const slider = sliderRef.current;

      if (!slider || bestSeller.length === 0) return;

      let lastTime = performance.now();

      // Smaller = slower
      const speed = 0.045;

      const animate = (currentTime) => {
        const delta = Math.min(currentTime - lastTime, 32);
        lastTime = currentTime;

        if (!pausedRef.current) {
          const maxScroll = slider.scrollWidth - slider.clientWidth;

          if (maxScroll > 0) {
            slider.scrollLeft += delta * speed;

            // Restart from beginning
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
    }, [bestSeller]);

    // -----------------------------------------
    // PAUSE / RESUME
    // -----------------------------------------
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
      }, 700);
    };

    // -----------------------------------------
    // GET CARD SCROLL WIDTH
    // -----------------------------------------
    const getScrollAmount = () => {
      const slider = sliderRef.current;

      if (!slider) return 0;

      const card = slider.querySelector("[data-card]");

      if (!card) return 0;

      const sliderStyles = window.getComputedStyle(slider);

      const gap =
        parseFloat(sliderStyles.columnGap) || parseFloat(sliderStyles.gap) || 0;

      return card.offsetWidth + gap;
    };

    // -----------------------------------------
    // PREVIOUS
    // -----------------------------------------
    const handlePrevious = () => {
      const slider = sliderRef.current;

      if (!slider) return;

      pausedRef.current = true;

      slider.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });

      setTimeout(() => {
        pausedRef.current = false;
      }, 700);
    };

    // -----------------------------------------
    // NEXT
    // -----------------------------------------
    const handleNext = () => {
      const slider = sliderRef.current;

      if (!slider) return;

      pausedRef.current = true;

      slider.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });

      setTimeout(() => {
        pausedRef.current = false;
      }, 700);
    };

    // -----------------------------------------
    // PRODUCT CARD
    // -----------------------------------------
    const renderProduct = (item, index) => {
      return (
        <div
          key={item?._id || index}
          data-card
          className="
            box-border
            w-[82%]
            shrink-0

            sm:w-[48%]

            md:w-[32%]

            lg:w-[calc((100%-72px)/4)]

            xl:w-[calc((100%-72px)/4)]
          "
        >
          <ProductCard
            id={item?._id}
            image={item?.image?.[0]}
            name={item?.name}
            price={item?.price}
            description={item?.description}
            offer={item?.offer}
            stock={item?.stock}
            bestSeller={true}
            category={item?.category}
          />
        </div>
      );
    };

    // -----------------------------------------
    // VIEW MORE CARD
    // -----------------------------------------
    const renderViewMore = () => {
      return (
        <button
          type="button"
          data-card
          onClick={() => navigate("/collection")}
          className="
            group
            box-border
            flex
            w-[82%]
            shrink-0
            items-center
            justify-center

            rounded-2xl
            border
            border-[#D8C9B8]
            bg-[#FBF8F4]

            px-6
            py-10

            text-center

            transition-all
            duration-300

            hover:-translate-y-1
            hover:border-[#6A4E3B]
            hover:bg-[#F2E5D6]
            hover:shadow-[0_20px_45px_rgba(115,82,45,0.14)]

            sm:w-[48%]
            sm:rounded-[26px]

            md:w-[32%]

            lg:w-[calc((100%-72px)/4)]

            xl:w-[calc((100%-72px)/4)]
            xl:rounded-[30px]
          "
        >
          <div className="flex flex-col items-center">
            {/* Arrow Circle */}
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

            {/* Title */}
            <h3
              className="
                font-serif
                text-lg
                font-medium
                text-[#3B2B20]

                sm:text-xl
              "
            >
              View More
            </h3>

            {/* Description */}
            <p
              className="
                mt-2
                max-w-[200px]
                text-xs
                leading-5
                text-[#806F62]

                sm:text-sm
              "
            >
              Explore all our best-selling furniture
            </p>
          </div>
        </button>
      );
    };

    // -----------------------------------------
    // DON'T RENDER IF EMPTY
    // -----------------------------------------
    if (!bestSeller.length) {
      return null;
    }

    return (
      <section className="my-12 w-full sm:my-16 lg:my-20">
        <div className="mx-auto w-full max-w-[1550px]">
          {/* =========================================
              HEADER
          ========================================= */}
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
            {/* Heading */}
            <div className="min-w-0 text-center lg:text-left">
              {/* Small Label */}
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
                <span className="h-px w-8 bg-[#9A795B] sm:w-10" />

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
                  Best Seller
                </span>

                <span className="h-px w-8 bg-[#C8A77F] sm:w-10" />
              </div>

              {/* Main Heading */}
              <h2
                className="
                  font-serif
                  text-[30px]
                  font-medium
                  leading-[1.08]
                  tracking-[-0.035em]
                  text-[#2F241D]

                  sm:text-[38px]

                  lg:text-[44px]

                  xl:text-[48px]
                "
              >
                Loved by Homes,
                <br className="hidden sm:block" />
                <span className="text-[#8A6B50]"> Chosen by You</span>
              </h2>

              {/* Description */}
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
                Discover our most-loved furniture, crafted with premium materials,
                timeless design, and exceptional comfort to elevate every space
                beautifully.
              </p>
            </div>

            {/* Desktop Arrows */}
            <div
              className="
                hidden
                shrink-0
                items-center
                gap-3

                lg:flex
              "
            >
              {/* Previous */}
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

              {/* Next */}
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

          {/* =========================================
              SLIDER
          ========================================= */}
          <div
            ref={sliderRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="
              best-seller-slider
              flex
              w-full
              gap-4
              overflow-x-auto
              overflow-y-visible
              px-4
              pb-5
              pt-1

              sm:gap-5
              sm:px-6

              lg:gap-6
              lg:px-8

              xl:px-10
            "
          >
            {bestSeller.map(renderProduct)}

            {renderViewMore()}
          </div>

          {/* =========================================
              MOBILE SWIPE INDICATOR
          ========================================= */}
          <div
            className="
              mt-2
              flex
              items-center
              justify-center
              gap-2
              px-4
              text-center
              text-[10px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-[#9A8068]

              lg:hidden
            "
          >
            <FiArrowLeft className="shrink-0" />

            <span>Swipe to explore</span>

            <FiArrowRight className="shrink-0" />
          </div>
        </div>

        {/* =========================================
            HIDE SCROLLBAR
        ========================================= */}
        <style>
          {`
            .best-seller-slider::-webkit-scrollbar {
              display: none;
            }

            .best-seller-slider {
              scrollbar-width: none;
              -ms-overflow-style: none;
              scroll-behavior: auto;
              -webkit-overflow-scrolling: touch;
            }

            .best-seller-slider > * {
              min-width: 0;
            }
          `}
        </style>
      </section>
    );
  };

  export default BestSellers;
