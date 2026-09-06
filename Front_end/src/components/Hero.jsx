import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const Hero = () => {
  // =========================================================
  // HERO IMAGES
  // =========================================================

  const heroImages = [assets.hero, assets.hero1, assets.hero2, assets.hero3];

  const [currentImage, setCurrentImage] = useState(0);

  // =========================================================
  // AUTO CHANGE HERO IMAGE
  // =========================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="w-full px-3 pt-3 sm:px-5 sm:pt-5 lg:px-8 lg:pt-8">
      <div
        className="
          relative
          mx-auto
          max-w-[1600px]
          overflow-hidden
          
          bg-[#F3EEE8]
          font-manrope
          shadow-[0_25px_80px_rgba(61,45,34,0.10)]

          
          
        "
      >
        {/* =========================================================
            BACKGROUND DECORATION
        ========================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            -left-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#E4D5C5]
            opacity-40
            blur-[90px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            left-[30%]
            h-[350px]
            w-[350px]
            rounded-full
            bg-[#DCC8B3]
            opacity-30
            blur-[100px]
          "
        />

        {/* =========================================================
            MAIN HERO
        ========================================================= */}

        <div
          className="
            relative
            flex
            min-h-[620px]
            flex-col

            lg:min-h-[720px]
            lg:flex-row
          "
        >
          {/* =======================================================
              LEFT CONTENT
          ======================================================= */}

          <div
            className="
              relative
              z-20
              flex
              w-full
              flex-col
              justify-center
              px-6
              pb-14
              pt-14

              sm:px-10
              sm:pb-16
              sm:pt-16

              md:px-14
              md:py-20

              lg:w-[52%]
              lg:px-14
              lg:py-20

              xl:px-20
              xl:py-24
            "
          >
            {/* =====================================================
                TOP LABEL
            ===================================================== */}

            <div
              className="
                mb-7
                flex
                items-center
                gap-3

                sm:mb-9
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-[#967452]

                  sm:w-11
                "
              />

              <span
                className="
                  font-manrope
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-[#806954]

                  sm:text-[10px]

                  md:text-[11px]
                "
              >
                Crafted for Living
              </span>
            </div>

            {/* =====================================================
                MAIN HEADING
            ===================================================== */}

            <h1
              className="
                max-w-[780px]
                font-heading
                text-[48px]
                font-light
                leading-[0.94]
                tracking-[-0.045em]
                text-[#29231F]

                sm:text-[62px]

                md:text-[72px]

                lg:text-[68px]

                xl:text-[84px]

                2xl:text-[92px]
              "
            >
              Elevate
              <br />
              <span className="text-[#87684D]">Your Living</span>
              <br />
              Space
            </h1>

            {/* =====================================================
                DESCRIPTION
            ===================================================== */}

            <div
              className="
                mt-7
                flex
                max-w-[550px]
                items-start
                gap-4

                sm:mt-8

                lg:mt-9
              "
            >
              <span
                className="
                  mt-2
                  h-10
                  w-px
                  shrink-0
                  bg-[#C8B6A4]
                "
              />

              <p
                className="
                  max-w-[470px]
                  font-manrope
                  text-[12px]
                  leading-[1.8]
                  text-[#71665E]

                  sm:text-sm
                  sm:leading-6

                  md:text-[15px]

                  lg:text-base
                "
              >
                Thoughtfully crafted furniture for modern homes — where refined
                design, lasting comfort, and everyday living come together.
              </p>
            </div>

            {/* =====================================================
                CTA BUTTONS
            ===================================================== */}

            <div
              className="
                mt-8
                flex
                flex-col
                gap-3

                sm:mt-10
                sm:flex-row
                sm:items-center
                sm:gap-4
              "
            >
              {/* ===================================================
                  EXPLORE COLLECTION
              =================================================== */}

              <Link
                to="/collection"
                className="
                  group
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-4
                  rounded-[10px]
                  bg-[#A97849]
                  px-6
                  font-heading
                  text-[15px]
                  font-medium
                  tracking-[0.01em]
                  text-white
                  shadow-[0_12px_30px_rgba(139,96,57,0.18)]
                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#8C633F]
                  hover:shadow-[0_16px_35px_rgba(139,96,57,0.25)]

                  active:translate-y-0

                  sm:h-13
                  sm:w-auto
                  sm:min-w-[205px]
                  sm:text-[16px]
                "
              >
                <span>Explore Collection</span>

                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-white/15
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                >
                  <FiArrowUpRight className="text-sm" />
                </span>
              </Link>

              {/* ===================================================
                  OUR STORY
              =================================================== */}

              <Link
                to="/about"
                className="
                  group
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[10px]
                  border
                  border-[#CBBBAA]
                  bg-white/20
                  px-6
                  font-heading
                  text-[15px]
                  font-medium
                  tracking-[0.01em]
                  text-[#40362F]
                  backdrop-blur-sm
                  transition-all
                  duration-300

                  hover:border-[#40362F]
                  hover:bg-[#40362F]
                  hover:text-white

                  active:translate-y-0

                  sm:h-13
                  sm:w-auto
                  sm:min-w-[125px]
                  sm:text-[16px]
                "
              >
                <span>Our Story</span>

                <FiArrowUpRight
                  className="
                    text-sm
                    opacity-60
                    transition-all
                    duration-300

                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    group-hover:opacity-100
                  "
                />
              </Link>
            </div>

            {/* =====================================================
                BOTTOM FEATURES
            ===================================================== */}

            <div
              className="
                mt-10
                flex
                max-w-[560px]
                items-center
                border-t
                border-[#D9CEC4]
                pt-6

                sm:mt-12
                sm:pt-7
              "
            >
              {/* Feature 1 */}

              <div className="flex-1">
                <p
                  className="
                    font-heading
                    text-[17px]
                    leading-none
                    text-[#40352C]

                    sm:text-xl
                  "
                >
                  Premium
                </p>

                <p
                  className="
                    mt-2
                    font-manrope
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-[#968577]

                    sm:text-[9px]
                  "
                >
                  Materials
                </p>
              </div>

              <div
                className="
                  h-9
                  w-px
                  bg-[#D2C4B8]
                "
              />

              {/* Feature 2 */}

              <div className="flex-1 px-5 sm:px-7">
                <p
                  className="
                    font-heading
                    text-[17px]
                    leading-none
                    text-[#40352C]

                    sm:text-xl
                  "
                >
                  Timeless
                </p>

                <p
                  className="
                    mt-2
                    font-manrope
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-[#968577]

                    sm:text-[9px]
                  "
                >
                  Design
                </p>
              </div>

              <div
                className="
                  h-9
                  w-px
                  bg-[#D2C4B8]
                "
              />

              {/* Feature 3 */}

              <div className="flex-1 pl-5 sm:pl-7">
                <p
                  className="
                    font-heading
                    text-[17px]
                    leading-none
                    text-[#40352C]

                    sm:text-xl
                  "
                >
                  Comfort
                </p>

                <p
                  className="
                    mt-2
                    font-manrope
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-[#968577]

                    sm:text-[9px]
                  "
                >
                  First
                </p>
              </div>
            </div>
          </div>

          {/* =======================================================
              RIGHT IMAGE
          ======================================================= */}

          <div
            className="
              relative
              w-full

              lg:w-[48%]
            "
          >
            <div
              className="
                relative
                h-[360px]
                w-full
                overflow-hidden

                sm:h-[460px]

                md:h-[550px]

                lg:absolute
                lg:inset-0
                lg:h-full
              "
            >
              {/* =================================================
                  HERO IMAGE
              ================================================= */}

              <img
                key={currentImage}
                src={heroImages[currentImage]}
                alt="Premium sofa collection"
                className="
                  h-full
                  w-full
                  object-cover
                  object-center
                  animate-hero-image
                "
              />

              {/* =================================================
                  IMAGE OVERLAY
              ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#4A392D]/10
                  via-transparent
                  to-[#2D2119]/10
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#2B211A]/30
                  via-transparent
                  to-transparent
                "
              />

              {/* =================================================
                  NEW COLLECTION LABEL
              ================================================= */}

              <div
                className="
                  absolute
                  left-5
                  top-5
                  z-20
                  flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-white/30
                  bg-black/10
                  px-4
                  py-2
                  backdrop-blur-md

                  sm:left-7
                  sm:top-7
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-white
                  "
                />

                <span
                  className="
                    font-manrope
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-white

                    sm:text-[9px]
                  "
                >
                  New Collection
                </span>
              </div>

              {/* =================================================
                  MODERN LIVING BADGE
              ================================================= */}

              <div
                className="
                  absolute
                  bottom-5
                  right-5
                  z-20
                  min-w-[150px]
                  rounded-[14px]
                  border
                  border-white/40
                  bg-[#F9F6F2]/90
                  px-5
                  py-4
                  shadow-[0_15px_40px_rgba(38,27,19,0.18)]
                  backdrop-blur-md

                  sm:bottom-7
                  sm:right-7
                  sm:min-w-[175px]
                  sm:px-6
                  sm:py-5
                "
              >
                <p
                  className="
                    font-manrope
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#927153]

                    sm:text-[9px]
                  "
                >
                  Designed for
                </p>

                <p
                  className="
                    mt-1.5
                    font-heading
                    text-[17px]
                    text-[#342921]

                    sm:text-xl
                  "
                >
                  Modern Living
                </p>

                <div
                  className="
                    mt-3
                    h-px
                    w-full
                    bg-[#D8CCC1]
                  "
                />

                <p
                  className="
                    mt-2
                    font-manrope
                    text-[8px]
                    uppercase
                    tracking-[0.12em]
                    text-[#8A7B70]
                  "
                >
                  Comfort · Form · Function
                </p>
              </div>

              {/* =================================================
                  SLIDE NUMBER
              ================================================= */}

              <div
                className="
                  absolute
                  bottom-7
                  left-6
                  z-20
                  hidden
                  items-end
                  gap-2
                  text-white

                  sm:flex
                  sm:left-8
                "
              >
                <span
                  className="
                    font-heading
                    text-3xl
                    font-light
                  "
                >
                  {String(currentImage + 1).padStart(2, "0")}
                </span>

                <span
                  className="
                    mb-1
                    font-manrope
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    text-white/70
                  "
                >
                  / {String(heroImages.length).padStart(2, "0")}
                </span>
              </div>

              {/* =================================================
                  SLIDE DOTS
              ================================================= */}

              <div
                className="
                  absolute
                  bottom-7
                  left-1/2
                  z-20
                  flex
                  -translate-x-1/2
                  items-center
                  gap-2
                "
              >
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImage(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`
                      h-1
                      rounded-full
                      transition-all
                      duration-500

                      ${
                        currentImage === index
                          ? "w-8 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* =====================================================
                VERTICAL SIDE LABEL
            ===================================================== */}

            <div
              className="
                absolute
                bottom-10
                right-2
                z-30
                hidden
                rotate-90
                origin-bottom-right

                xl:block
              "
            >
              <span
                className="
                  font-manrope
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.35em]
                  text-white/70
                "
              >
                Furniture · Since 2024
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            DECORATIVE CORNERS
        ========================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            h-16
            w-16
            rounded-tr-[30px]
            border-r
            border-t
            border-[#D8C9BA]/50
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            h-16
            w-16
            rounded-bl-[30px]
            border-b
            border-l
            border-[#D8C9BA]/40
          "
        />
      </div>

      {/* =========================================================
          HERO IMAGE ANIMATION
      ========================================================= */}

      <style>
        {`
          @keyframes heroImageFade {
            from {
              opacity: 0;
              transform: scale(1.025);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-hero-image {
            animation: heroImageFade 900ms ease-out;
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
