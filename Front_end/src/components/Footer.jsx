import React from "react";
import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiFacebook,
  FiMail,
  FiPhone,
  FiArrowUpRight,
} from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-16 bg-[#2E2722] font-manrope text-[#F5EFE8] sm:mt-20">
      <div className="mx-auto max-w-[1450px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        {/* ================= TOP ================= */}

        <div
          className="
            flex
            flex-col
            gap-8
            border-b
            border-white/10
            pb-9

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          {/* Brand */}

          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#C59668]" />

              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#C9A986]
                "
              >
                RSU Furniture
              </span>
            </div>

            <h2
              className="
                mt-3
                font-heading
                text-4xl
                font-medium
                leading-none
                tracking-[-0.04em]
                text-[#F8F3ED]

                sm:text-5xl
              "
            >
              RSU
            </h2>
          </div>

          {/* Tagline */}

          <p
            className="
              max-w-md
              font-heading
              text-base
              leading-6
              text-[#BFB1A6]

              sm:text-lg
              sm:text-right
            "
          >
            Furniture designed to make{" "}
            <span className="italic text-[#C9A986]">
              living feel beautiful.
            </span>
          </p>
        </div>

        {/* ================= LINKS ================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-8
            py-9

            sm:grid-cols-4
            sm:gap-10
          "
        >
          {/* About */}

          <div className="col-span-2 sm:col-span-1">
            <h3
              className="
                font-heading
                text-lg
                font-medium
                text-[#F5EFE8]
              "
            >
              About RSU
            </h3>

            <p
              className="
                mt-2
                max-w-xs
                text-[11px]
                leading-5
                text-[#968980]

                sm:text-xs
              "
            >
              Timeless furniture, premium craftsmanship, and everyday comfort
              for modern living.
            </p>
          </div>

          {/* Explore */}

          <div>
            <h3
              className="
                mb-3
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#C9A986]
              "
            >
              Explore
            </h3>

            <div className="space-y-2">
              <Link
                to="/"
                className="
                  block
                  font-heading
                  text-sm
                  text-[#C8BDB4]
                  transition-colors
                  hover:text-[#C9A986]
                "
              >
                Home
              </Link>

              <Link
                to="/collection"
                className="
                  block
                  font-heading
                  text-sm
                  text-[#C8BDB4]
                  transition-colors
                  hover:text-[#C9A986]
                "
              >
                Collection
              </Link>

              <Link
                to="/about"
                className="
                  block
                  font-heading
                  text-sm
                  text-[#C8BDB4]
                  transition-colors
                  hover:text-[#C9A986]
                "
              >
                About
              </Link>

              <Link
                to="/contact"
                className="
                  block
                  font-heading
                  text-sm
                  text-[#C8BDB4]
                  transition-colors
                  hover:text-[#C9A986]
                "
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact */}

          <div>
            <h3
              className="
                mb-3
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#C9A986]
              "
            >
              Contact
            </h3>

            <div className="space-y-2.5 text-[11px] text-[#B5A9A0]">
              <a
                href="tel:+9779800000000"
                className="flex items-center gap-2 transition-colors hover:text-[#C9A986]"
              >
                <FiPhone className="text-xs" />
                +977 9800000000
              </a>

              <a
                href="mailto:rsufurnitures@gmail.com"
                className="
                  flex
                  items-center
                  gap-2
                  break-all
                  transition-colors
                  hover:text-[#C9A986]
                "
              >
                <FiMail className="shrink-0 text-xs" />
                rsufurnitures@gmail.com
              </a>

              <p>Pokhara, Nepal</p>
            </div>
          </div>

          {/* Social */}

          <div>
            <h3
              className="
                mb-3
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#C9A986]
              "
            >
              Follow Us
            </h3>

            <div className="flex gap-2.5">
              <a
                href="#"
                aria-label="Instagram"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-[#C8BDB4]
                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:border-[#C59668]
                  hover:bg-[#C59668]
                  hover:text-white
                "
              >
                <FiInstagram className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-[#C8BDB4]
                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:border-[#C59668]
                  hover:bg-[#C59668]
                  hover:text-white
                "
              >
                <FiFacebook className="text-sm" />
              </a>

              <a
                href="#"
                aria-label="TikTok"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-[#C8BDB4]
                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:border-[#C59668]
                  hover:bg-[#C59668]
                  hover:text-white
                "
              >
                <FaTiktok className="text-[13px]" />
              </a>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-white/10
            pt-5

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.1em]
              text-[#81756D]
            "
          >
            © {new Date().getFullYear()} RSU Furniture
          </p>

          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-[#80634B]" />

            <span
              className="
                font-heading
                text-[10px]
                italic
                text-[#918279]
              "
            >
              Crafted with intention.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
