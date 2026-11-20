import React, { useState, useEffect } from "react";
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
import api from "../services/api";

// GET DATA FROM API RESPONSE
const getRecords = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.games)) return data.games;

  return [];
};

// REUSABLE BADGE
const CountBadge = ({ count }) => {
  if (!count) return null;

  return (
    <span className="absolute -top-2 -right-3 min-w-[19px] h-[19px] px-1 flex items-center justify-center bg-purple-600 text-white text-[10px] font-bold rounded-full border-2 border-[#1a1a1a]">
      {count > 99 ? "99+" : count}
    </span>
  );
};

// SEARCH BOX COMPONENT
const SearchBox = ({
  mobile = false,
  searchTerm,
  setSearchTerm,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  handleSearch,
  handleSuggestionClick,
}) => {
  return (
    <div className="relative">
      <form
        onSubmit={handleSearch}
        className={`flex items-center bg-[#111111] border border-[#30283F] rounded-full ${
          mobile ? "px-4 py-3" : "px-3 py-2"
        }`}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim()) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowSuggestions(false);
            }
          }}
          className={`bg-transparent outline-none text-sm text-white placeholder-gray-500 ${
            mobile ? "flex-1 min-w-0" : "w-28 lg:w-36"
          }`}
        />

        <button type="submit" aria-label="Search">
          <Search
            size={mobile ? 19 : 18}
            className="text-gray-400 hover:text-purple-400 transition"
          />
        </button>
      </form>

      {/* SEARCH SUGGESTIONS */}
      {showSuggestions && searchTerm.trim() && (
        <div className="absolute top-full left-0 mt-3 w-[280px] sm:w-[320px] bg-[#1a1a1a] border border-[#30283F] rounded-xl shadow-2xl overflow-hidden z-[100]">

          {suggestions.length > 0 ? (
            <>
              <p className="px-4 py-3 text-xs font-semibold text-gray-400 border-b border-[#30283F]">
                SEARCH SUGGESTIONS
              </p>

              {suggestions.map((item) => (
                <button
                  key={`${item.itemType}-${item.id}`}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-600/20 transition border-b border-[#30283F] last:border-none"
                >
                  <img
                    src={item.image || item.images?.[0] || ""}
                    alt={item.name}
                    className="w-12 h-12 object-contain rounded-lg bg-[#111111] p-1 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {item.itemType === "game"
                        ? "Game"
                        : item.category || "Product"}
                    </p>

                    <p className="text-sm text-purple-400 mt-1">
                      ₹{Number(item.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </button>
              ))}

              <button
                type="button"
                onClick={handleSearch}
                className="w-full text-center px-4 py-3 text-sm text-purple-400 hover:text-white hover:bg-purple-600/20 transition"
              >
                View all search results →
              </button>
            </>
          ) : (
            <p className="px-4 py-5 text-sm text-gray-400 text-center">
              No matching games or accessories found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // SEARCH DATA
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // REDUX DATA
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // AUTHENTICATION PAGES
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // COUNTS
  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;

  // NAVIGATION LINKS
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // FETCH BOTH PRODUCTS AND GAMES
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [productsResponse, gamesResponse] = await Promise.allSettled([
          api.get("/products"),
          api.get("/games"),
        ]);

        let products = [];
        let games = [];

        if (productsResponse.status === "fulfilled") {
          products = getRecords(productsResponse.value).map((item) => ({
            ...item,
            itemType: "product",
          }));
        } else {
          console.error(
            "Failed to fetch products:",
            productsResponse.reason
          );
        }

        if (gamesResponse.status === "fulfilled") {
          games = getRecords(gamesResponse.value).map((item) => ({
            ...item,
            itemType: "game",
          }));
        } else {
          console.error(
            "Failed to fetch games:",
            gamesResponse.reason
          );
        }

        // COMBINE BOTH COLLECTIONS
        setAllProducts([...products, ...games]);
      } catch (error) {
        console.error("Search data loading failed:", error);
      }
    };

    fetchSearchData();
  }, []);

  // SEARCH NORMALIZATION
  const normalize = (value) => {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  };

  // SEARCH GAMES AND PRODUCTS AFTER 2 SECONDS
  useEffect(() => {
    const search = normalize(searchTerm);

    if (!search) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(false);

    const timer = setTimeout(() => {
      const filteredItems = allProducts
        .filter((item) => {
          const searchableFields = [
            item.name,
            item.brand,
            item.category,
            item.description,
            item.platform,
            item.genre,
            item.itemType,
            ...(Array.isArray(item.tags) ? item.tags : []),
            ...Object.values(item.specifications || {}),
          ];

          return searchableFields.some((field) =>
            normalize(field).includes(search)
          );
        })
        .slice(0, 4);

      setSuggestions(filteredItems);
      setShowSuggestions(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchTerm, allProducts]);

  // SEARCH SUBMIT
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    navigate(
      `/products?search=${encodeURIComponent(searchTerm.trim())}`
    );

    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setMenuOpen(false);
  };

  // OPEN PRODUCT OR GAME DETAILS
  const handleSuggestionClick = (item) => {
    if (item.itemType === "game") {
      navigate(`/product/${item.id}?type=game`);
    } else {
      navigate(`/product/${item.id}`);
    }

    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setMenuOpen(false);
  };

  // LOGOUT
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

  // SEARCH BOX PROPS
  const searchBoxProps = {
    searchTerm,
    setSearchTerm,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleSearch,
    handleSuggestionClick,
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111111] px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto bg-[#1a1a1a] border border-[#292929] rounded-full px-5 md:px-8 py-3">

        {/* AUTH PAGE NAVBAR */}
        {isAuthPage ? (
          <div className="relative flex items-center justify-between min-h-[42px]">
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-extrabold tracking-wide text-white whitespace-nowrap"
            >
              GAME
              <span className="text-purple-500"> DOCK</span>
            </Link>

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
          <>
            {/* NORMAL NAVBAR */}
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
                <div className="hidden md:block">
                  <SearchBox {...searchBoxProps} />
                </div>

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

                {/* DESKTOP PROFILE */}
                <div className="hidden md:block relative group">
                  {user ? (
                    <>
                      <button className="flex flex-col items-center justify-center text-gray-300 hover:text-purple-400 transition cursor-pointer">
                        <UserRound size={22} />

                        <span className="text-[11px] mt-1 max-w-[90px] truncate">
                          {user.name}
                        </span>
                      </button>

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

                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white transition"
                          >
                            <UserRound size={17} />
                            My Profile
                          </Link>

                          <Link
                            to="/my-orders"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white transition"
                          >
                            <Package size={17} />
                            My Orders
                          </Link>

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
                <div className="mb-4">
                  <SearchBox mobile {...searchBoxProps} />
                </div>

                {/* MOBILE NAVIGATION */}
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
                          <UserRound
                            size={21}
                            className="text-purple-400"
                          />
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