import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  UserRound,
  LogOut,
  Package,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // REDUX DATA
  const user = useSelector((state) => state.auth.user);

  const cartItems = useSelector((state) => state.cart.items);

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // CHECK AUTHENTICATION PAGES
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // COUNT UNIQUE CART ITEMS
  const cartCount = cartItems.length;

  // WISHLIST COUNT
  const wishlistCount = wishlistItems.length;

  // NAVIGATION LINKS
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // SEARCH FUNCTIONALITY
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(
        `/products?search=${encodeURIComponent(
          searchTerm.trim()
        )}`
      );

      setSearchTerm("");
      setMenuOpen(false);
    }
  };

  // LOGOUT FUNCTIONALITY
  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("user");

    navigate("/");

    setMenuOpen(false);
  };

  // CLOSE MOBILE MENU
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // REUSABLE BADGE
  const CountBadge = ({ count }) => {
    if (count === 0) return null;

    return (
      <span className="absolute -top-2 -right-3 min-w-[19px] h-[19px] px-1 flex items-center justify-center bg-purple-600 text-white text-[10px] font-bold rounded-full border-2 border-[#1a1a1a]">
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111111] px-4 md:px-6 py-4">

      <div className="max-w-7xl mx-auto bg-[#1a1a1a] border border-[#292929] rounded-full px-5 md:px-8 py-3">

        {/* AUTH PAGE NAVBAR */}
        {isAuthPage ? (

          <div className="relative flex items-center justify-between min-h-[42px]">

            {/* CENTERED LOGO */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-extrabold tracking-wide text-white whitespace-nowrap"
            >
              GAME
              <span className="text-purple-500"> DOCK</span>
            </Link>

            {/* LOGIN / REGISTER */}
            <div className="ml-auto flex items-center gap-2 md:gap-3 text-sm font-semibold">

              <Link
                to="/login"
                className={`transition ${
                  location.pathname === "/login"
                    ? "text-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </Link>

              <span className="text-gray-600">|</span>

              <Link
                to="/register"
                className={`transition ${
                  location.pathname === "/register"
                    ? "text-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Register
              </Link>

            </div>

          </div>

        ) : (

          /* NORMAL NAVBAR */
          <>
            <div className="flex items-center justify-between gap-4">

              {/* LOGO */}
              <Link
                to="/"
                className="text-xl md:text-2xl font-extrabold tracking-wide text-white shrink-0"
              >
                GAME
                <span className="text-purple-500"> DOCK</span>
              </Link>

              {/* DESKTOP NAVIGATION */}
              <div className="hidden lg:flex items-center gap-7">

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.name}
                  </Link>
                ))}

              </div>

              {/* RIGHT SECTION */}
              <div className="flex items-center gap-4 md:gap-5">

                {/* DESKTOP SEARCH */}
                <form
                  onSubmit={handleSearch}
                  className="hidden md:flex items-center bg-[#111111] border border-[#30283F] rounded-full px-3 py-2"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-28 lg:w-36"
                  />

                  <button type="submit" aria-label="Search">
                    <Search
                      size={18}
                      className="text-gray-400 hover:text-purple-400 transition"
                    />
                  </button>
                </form>

                {/* WISHLIST */}
                <Link
                  to="/wishlist"
                  className="relative text-gray-300 hover:text-purple-400 transition"
                  aria-label={`Wishlist, ${wishlistCount} items`}
                >
                  <Heart size={21} />
                  <CountBadge count={wishlistCount} />
                </Link>

                {/* CART */}
                <Link
                  to="/cart"
                  className="relative text-gray-300 hover:text-purple-400 transition"
                  aria-label={`Cart, ${cartCount} items`}
                >
                  <ShoppingCart size={21} />
                  <CountBadge count={cartCount} />
                </Link>

                {/* DESKTOP PROFILE DROPDOWN */}
                <div className="hidden md:block relative group">

                  {user ? (
                    <>
                      {/* PROFILE ICON AND NAME */}
                      <button className="flex flex-col items-center justify-center text-gray-300 hover:text-purple-400 transition cursor-pointer">
                        <UserRound size={22} />

                        <span className="text-[11px] mt-1 max-w-[90px] truncate">
                          {user.name}
                        </span>
                      </button>

                      {/* PROFILE DROPDOWN */}
                      <div className="absolute right-0 top-full pt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">

                        <div className="bg-[#1a1a1a] border border-[#30283F] rounded-xl shadow-xl overflow-hidden">

                          <div className="px-4 py-3 border-b border-[#30283F]">
                            <p className="text-white text-sm font-semibold truncate">
                              {user.name}
                            </p>

                            <p className="text-gray-500 text-xs">
                              My Account
                            </p>
                          </div>

                          {/* MY PROFILE */}
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white transition"
                          >
                            <UserRound size={17} />
                            My Profile
                          </Link>

                          {/* MY ORDERS */}
                          <Link
                            to="/my-orders"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white transition"
                          >
                            <Package size={17} />
                            My Orders
                          </Link>

                          {/* LOGOUT */}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition border-t border-[#30283F]"
                          >
                            <LogOut size={17} />
                            Logout
                          </button>

                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                    >
                      <UserRound size={16} />
                      Login
                    </Link>
                  )}

                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="lg:hidden text-gray-300 hover:text-purple-400 transition"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

              </div>

            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
              <div className="lg:hidden mt-5 pt-4 border-t border-[#30283F]">

                {/* MOBILE SEARCH */}
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-[#111111] border border-[#30283F] rounded-full px-4 py-3 mb-4"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none text-sm text-white placeholder-gray-500 flex-1 min-w-0"
                  />

                  <button type="submit" aria-label="Search">
                    <Search
                      size={19}
                      className="text-gray-400 hover:text-purple-400"
                    />
                  </button>
                </form>

                {/* MOBILE NAVIGATION LINKS */}
                <div className="flex flex-col gap-4">

                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={closeMenu}
                      className="text-gray-300 hover:text-purple-400 text-sm font-medium transition"
                    >
                      {link.name}
                    </Link>
                  ))}

                </div>

                {/* MOBILE AUTHENTICATION */}
                <div className="mt-5 pt-4 border-t border-[#30283F]">

                  {user ? (
                    <div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                          <UserRound size={21} className="text-purple-400" />
                        </div>

                        <div>
                          <p className="text-white text-sm font-semibold">
                            {user.name}
                          </p>

                          <p className="text-gray-500 text-xs">
                            My Account
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-gray-300 hover:text-purple-400 text-sm py-3"
                      >
                        <UserRound size={17} />
                        My Profile
                      </Link>

                      <Link
                        to="/my-orders"
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-gray-300 hover:text-purple-400 text-sm py-3"
                      >
                        <Package size={17} />
                        My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-400 hover:text-red-300 text-sm py-3"
                      >
                        <LogOut size={17} />
                        Logout
                      </button>

                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-3 rounded-full transition"
                    >
                      <UserRound size={16} />
                      Login / Register
                    </Link>
                  )}

                </div>

              </div>
            )}
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;