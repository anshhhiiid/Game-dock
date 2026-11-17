import React from "react";
import { Link } from "react-router-dom";
import { Gamepad2, ArrowRight } from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#292929] text-gray-400">

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-white">
              <Gamepad2 size={30} className="text-purple-500" />

              <span className="text-2xl font-bold tracking-wide">
                GAME <span className="text-purple-500">DOCK</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7">
              Your ultimate destination for gaming consoles,
              accessories and games. Level up your gaming experience
              with GAME DOCK.
            </p>

            <div className="flex gap-4 mt-6">

  <a
    href="https://www.instagram.com/anshhhiiid/"
    target="_blank"
    rel="noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#252525] text-gray-300 hover:bg-purple-600 hover:text-white transition-all duration-300"
  >
    <FaInstagram size={19} />
  </a>

  <a
    href="https://www.facebook.com/"
    target="_blank"
    rel="noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#252525] text-gray-300 hover:bg-purple-600 hover:text-white transition-all duration-300"
  >
    <FaFacebookF size={18} />
  </a>

  <a
    href="https://x.com/"
    target="_blank"
    rel="noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#252525] text-gray-300 hover:bg-purple-600 hover:text-white transition-all duration-300"
  >
    <FaXTwitter size={18} />
  </a>

  <a
    href="https://www.youtube.com/"
    target="_blank"
    rel="noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#252525] text-gray-300 hover:bg-purple-600 hover:text-white transition-all duration-300"
  >
    <FaYoutube size={20} />
  </a>

</div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-purple-500">Home</Link></li>
              <li><Link to="/products" className="hover:text-purple-500">All Products</Link></li>
              <li><Link to="/games" className="hover:text-purple-500">Games</Link></li>
              <li><Link to="/offers" className="hover:text-purple-500">Offers</Link></li>
              <li><Link to="/about" className="hover:text-purple-500">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Categories
            </h3>

            <ul className="space-y-3 text-sm">
              <li><Link to="/products?brand=Sony" className="hover:text-purple-500">PlayStation</Link></li>
              <li><Link to="/products?brand=Microsoft" className="hover:text-purple-500">Xbox</Link></li>
              <li><Link to="/products?brand=Nintendo" className="hover:text-purple-500">Nintendo</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-purple-500">Accessories</Link></li>
              <li><Link to="/games" className="hover:text-purple-500">Video Games</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Stay Connected
            </h3>

            <p className="text-sm leading-6 mb-5">
              Get updates about new arrivals, exclusive deals and gaming news.
            </p>

            <div className="flex items-center bg-[#1c1c1c] border border-[#333] rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none min-w-0"
              />

              <button className="bg-purple-600 hover:bg-purple-700 p-3 text-white transition">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#292929] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

          <p>
            © {new Date().getFullYear()} GAME DOCK. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-purple-500">
              Privacy Policy
            </Link>

            <Link to="/terms" className="hover:text-purple-500">
              Terms & Conditions
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
