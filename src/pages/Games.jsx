import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Heart, Star, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

import { fetchGames } from "../redux/slices/gameSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist } from "../redux/slices/wishlistSlice";

import ProductFilters from "../components/ProductFilters";

function Games() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { games, loading, error } = useSelector(
    (state) => state.games
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const [filters, setFilters] = useState({
    platform: [],
    category: [],
    brand: [],
  });

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 8;

  // FETCH GAMES
  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  // FILTER OPTIONS
  const platforms = useMemo(
    () => [...new Set(games.map((g) => g.platform).filter(Boolean))],
    [games]
  );

  const categories = useMemo(
    () => [...new Set(games.map((g) => g.category).filter(Boolean))],
    [games]
  );

  const brands = useMemo(
    () => [...new Set(games.map((g) => g.brand).filter(Boolean))],
    [games]
  );

  const groups = [
    {
      key: "platform",
      label: "Platforms",
      options: platforms,
    },
    {
      key: "category",
      label: "Genres",
      options: categories,
    },
    {
      key: "brand",
      label: "Publishers",
      options: brands,
    },
  ];

  // FILTER CHANGE
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  // PRICE CHANGE
  const handlePriceChange = (type, value) => {
    if (type === "min") {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
  };

  // CLEAR FILTERS
  const clearFilters = () => {
    setFilters({
      platform: [],
      category: [],
      brand: [],
    });

    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setInStock(false);
    setSort("featured");
  };

  // FILTER AND SORT
  const filteredGames = useMemo(() => {
    let result = [...games];

    if (filters.platform.length > 0) {
      result = result.filter((game) =>
        filters.platform.includes(game.platform)
      );
    }

    if (filters.category.length > 0) {
      result = result.filter((game) =>
        filters.category.includes(game.category)
      );
    }

    if (filters.brand.length > 0) {
      result = result.filter((game) =>
        filters.brand.includes(game.brand)
      );
    }

    if (minPrice !== "") {
      result = result.filter(
        (game) => Number(game.price) >= Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (game) => Number(game.price) <= Number(maxPrice)
      );
    }

    if (rating !== "") {
      result = result.filter(
        (game) => Number(game.rating) >= Number(rating)
      );
    }

    if (inStock) {
      result = result.filter(
        (game) => Number(game.stock) > 0
      );
    }

    switch (sort) {
      case "priceLow":
        result.sort(
          (a, b) => Number(a.price) - Number(b.price)
        );
        break;

      case "priceHigh":
        result.sort(
          (a, b) => Number(b.price) - Number(a.price)
        );
        break;

      case "rating":
        result.sort(
          (a, b) => Number(b.rating) - Number(a.rating)
        );
        break;

      case "name":
        result.sort(
          (a, b) => a.name.localeCompare(b.name)
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    games,
    filters,
    minPrice,
    maxPrice,
    rating,
    inStock,
    sort,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, minPrice, maxPrice, rating, inStock, sort]);

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + gamesPerPage);

  // VIEW GAME DETAILS
  const handleViewDetails = (game) => {
    navigate(`/product/${game.id}?type=game`);
  };

  // ADD TO CART
  const handleAddToCart = (game) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const stock = Number(game.stock) || 0;

    if (stock <= 0) {
      toast.error("This game is out of stock!");
      return;
    }

    const existingItem = cartItems.find(
      (item) =>
        String(item.id) === String(game.id) &&
        item.itemType === "game"
    );

    if (existingItem) {
      toast("This game is already in your cart!", {
        icon: "🛒",
      });
      return;
    }

    dispatch(addToCart({ product: game, itemType: "game" }))
      .unwrap()
      .then(() => toast.success(`${game.name} added to cart!`))
      .catch((error) => toast.error(error || "Could not update your cart."));
  };

  // ADD TO WISHLIST
  const handleAddToWishlist = (game) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const alreadyExists = wishlistItems.some(
      (item) =>
        String(item.id) === String(game.id) &&
        item.itemType === "game"
    );

    if (alreadyExists) {
      toast("This game is already in your wishlist!", {
        icon: "❤️",
      });
      return;
    }

    dispatch(addToWishlist({ product: game, itemType: "game" }))
      .unwrap()
      .then(() => toast.success(`${game.name} added to wishlist!`))
      .catch((error) => toast.error(error || "Could not update your wishlist."));
  };

  // CHECK WISHLIST
  const isWishlisted = (game) => {
    return wishlistItems.some(
      (item) =>
        String(item.id) === String(game.id) &&
        item.itemType === "game"
    );
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#100E1B]">
        <p className="text-purple-400 text-lg">
          Loading games...
        </p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#100E1B]">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100E1B] text-white">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* HEADING */}
        <div className="mb-8">

          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-2">
            GAME DOCK COLLECTION
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold">
            Explore All Games
          </h1>

          <p className="text-gray-400 mt-3">
            Find your next favourite game from our collection.
          </p>

        </div>

        {/* FILTERS */}
        <div className="mb-6">
          <ProductFilters
            groups={groups}
            filters={filters}
            onChange={handleFilterChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            rating={rating}
            inStock={inStock}
            sort={sort}
            onPriceChange={handlePriceChange}
            onRatingChange={setRating}
            onStockChange={setInStock}
            onSortChange={setSort}
            onClear={clearFilters}
          />
        </div>

        {/* RESULT COUNT */}
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            Showing{" "}
            <span className="text-white font-semibold">
              {filteredGames.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + gamesPerPage, filteredGames.length)}
            </span>{" of "}
            <span className="text-white font-semibold">{filteredGames.length}</span> games
          </p>
        </div>

        {/* GAMES GRID */}
        {filteredGames.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {paginatedGames.map((game) => (

              <div
                key={game.id}
                className="bg-[#1A1827] border border-[#292638]
                rounded-xl overflow-hidden group
                hover:border-purple-500/60 transition duration-300"
              >

                {/* GAME IMAGE */}
                <div className="relative h-64 overflow-hidden bg-[#111111]">

                  <button
                    type="button"
                    onClick={() => handleViewDetails(game)}
                    className="w-full h-full cursor-pointer"
                    aria-label={`View ${game.name} details`}
                  >
                    <img
                      src={game.image}
                      alt={game.name}
                      className="block w-full h-full object-contain p-2
                      group-hover:scale-105 transition duration-500"
                    />
                  </button>

                  {/* WISHLIST */}
                  <button
                    onClick={() => handleAddToWishlist(game)}
                    className="absolute top-3 right-3 p-2
                    bg-black/60 backdrop-blur-sm rounded-full
                    hover:bg-purple-600 transition"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={18}
                      className={
                        isWishlisted(game)
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }
                    />
                  </button>
{/* STOCK STATUS */}
{Number(game.stock) <= 0 ? (
  <div className="absolute top-3 left-3 bg-red-600
  text-white text-xs px-3 py-1 rounded-full">
    Out of Stock
  </div>
) : Number(game.stock) <= 3 ? (
  <div className="absolute top-3 left-3 bg-orange-600
  text-white text-xs px-3 py-1 rounded-full">
    Only {game.stock} left!
  </div>
) : null}

                </div>

                {/* GAME DETAILS */}
                <div className="p-4">

                  <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider">
                    {game.brand}
                  </p>

                  <button
                    onClick={() => handleViewDetails(game)}
                    className="text-left text-white font-semibold
                    text-lg mt-2 line-clamp-1
                    hover:text-purple-400 transition"
                  >
                    {game.name}
                  </button>

                  <p className="text-gray-400 text-sm mt-1">
                    {game.platform}
                  </p>

                  {/* RATING */}
                  <div className="flex items-center gap-1 mt-3">

                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="text-sm text-gray-300">
                      {game.rating || "N/A"}
                    </span>

                  </div>

                  {/* PRICE */}
                  <p className="text-xl font-bold text-white mt-4">
                    ₹{Number(game.price).toLocaleString("en-IN")}
                  </p>

                  {/* ADD TO CART */}
                  <button
                    onClick={() => handleAddToCart(game)}
                    disabled={Number(game.stock) <= 0}
                    className="w-full mt-4 flex items-center
                    justify-center gap-2 py-2.5 rounded-lg
                    bg-purple-600 hover:bg-purple-700
                    disabled:bg-gray-600 disabled:cursor-not-allowed
                    text-white text-sm font-semibold transition"
                  >
                    <ShoppingCart size={17} />

                    {Number(game.stock) <= 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="text-center py-20">

            <h2 className="text-xl font-semibold text-white">
              No games found
            </h2>

            <p className="text-gray-400 mt-2">
              Try changing your filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 px-5 py-2 bg-purple-600
              hover:bg-purple-700 rounded-lg transition"
            >
              Clear Filters
            </button>

          </div>

        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-[#403650] text-gray-300 hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >Previous</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg border transition ${currentPage === page ? "bg-purple-600 border-purple-500 text-white" : "border-[#403650] text-gray-300 hover:border-purple-500"}`}
              >{page}</button>
            ))}
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-[#403650] text-gray-300 hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >Next</button>
          </div>
        )}

      </section>

    </div>
  );
}

export default Games;
