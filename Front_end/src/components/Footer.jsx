import React from "react";
import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiMail,
  FiPhone,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="mt-28 font-manrope">
      <div className=" grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="font-serif text-3xl text-[#3B2B20]">RSU</h2>

          <p className="mt-5 leading-7 text-[#7E746D]">
            Elevating homes with timeless furniture, premium craftsmanship, and
            luxurious comfort designed for modern living.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="mb-5 font-semibold uppercase tracking-widest text-[#3B2B20]">
            Explore
          </h3>

          <ul className="space-y-3 text-[#7E746D]">
            <li>
              <Link to="/" className="transition hover:text-[#B08A58]">
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/collection"
                className="transition hover:text-[#B08A58]"
              >
                Collection
              </Link>
            </li>

            <li>
              <Link to="/about" className="transition hover:text-[#B08A58]">
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" className="transition hover:text-[#B08A58]">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 font-semibold uppercase tracking-widest text-[#3B2B20]">
            Contact
          </h3>

          <div className="space-y-4 text-[#7E746D]">
            <p className="flex items-center gap-3">
              <FiPhone />
              +977 9800000000
            </p>

            <p className="flex items-center gap-3">
              <FiMail />
              hello@rsufurniture.com
            </p>

            <p>Pokhara, Nepal</p>
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-5 font-semibold uppercase tracking-widest text-[#3B2B20]">
            Follow Us
          </h3>

          <div className="flex gap-4">
            <a
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2E5D6] text-[#6A4E3B] transition hover:bg-[#B08A58] hover:text-white"
            >
              <FiInstagram size={18} />
            </a>

            <a
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2E5D6] text-[#6A4E3B] transition hover:bg-[#B08A58] hover:text-white"
            >
              <FiFacebook size={18} />
            </a>

            <a
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2E5D6] text-[#6A4E3B] transition hover:bg-[#B08A58] hover:text-white"
            >
              <FiTwitter size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#E6D8C8] py-6 text-center">
        <p className="text-sm text-[#8C827A]">
          © {new Date().getFullYear()} RSU Furniture. Crafted with elegance.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
