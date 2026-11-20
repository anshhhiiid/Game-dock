import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../redux/slices/productSlice";
import { fetchGames } from "../redux/slices/gameSlice";

import ProductCard from "../components/ProductCart";
import ProductFilters from "../components/ProductFilters";

function Products() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const selectedBrand = searchParams.get("brand") || "";

  // REDUX DATA
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.products);

  const {
    games,
    loading: gamesLoading,
    error: gamesError,
  } = useSelector((state) => state.games);

  const loading = productsLoading || gamesLoading;
  const error = productsError || gamesError;

  // FILTER STATES
  const [filters, setFilters] = useState({
    brand: selectedBrand ? [selectedBrand] : [],
    category: [],
  });

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // FETCH PRODUCTS AND GAMES
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchGames());
  }, [dispatch]);

  // UPDATE BRAND FILTER
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      brand: selectedBrand ? [selectedBrand] : [],
    }));
  }, [selectedBrand]);

  // NORMALIZE SEARCH
  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[\s-]+/g, "");

  // COMBINE CONSOLES AND GAMES
  const allProducts = useMemo(() => {
    const consoleItems = products.map((product) => ({
      ...product,
      itemType: "product",
    }));

    const gameItems = games.map((game) => ({
      ...game,
      itemType: "game",
    }));

    return [...consoleItems, ...gameItems];
  }, [products, games]);

  // AVAILABLE BRANDS
  const brands = useMemo(
    () => [
      ...new Set(
        allProducts.map((item) => item.brand).filter(Boolean)
      ),
    ],
    [allProducts]
  );

  // AVAILABLE CATEGORIES
  const categories = useMemo(
    () => [
      ...new Set(
        allProducts.map((item) => item.category).filter(Boolean)
      ),
    ],
    [allProducts]
  );

  // FILTER GROUPS
  const groups = [
    {
      key: "brand",
      label: "Brands",
      options: brands,
    },
    {
      key: "category",
      label: "Categories",
      options: categories,
    },
  ];

  // HANDLE FILTER CHANGE
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  // HANDLE PRICE CHANGE
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
      brand: [],
      category: [],
    });

    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setInStock(false);
    setSort("featured");
  };

  // FILTER AND SORT PRODUCTS
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // SEARCH FILTER
    if (searchQuery.trim()) {
      const search = normalize(searchQuery);

      result = result.filter((item) =>
        normalize(
          `${item.name} ${item.brand} ${item.category} ${
            item.description
          } ${item.platform || ""} ${item.genre || ""}`
        ).includes(search)
      );
    }

    // BRAND FILTER
    if (filters.brand.length > 0) {
      result = result.filter((item) =>
        filters.brand.includes(item.brand)
      );
    }

    // CATEGORY FILTER
    if (filters.category.length > 0) {
      result = result.filter((item) =>
        filters.category.includes(item.category)
      );
    }

    // MINIMUM PRICE
    if (minPrice !== "") {
      result = result.filter(
        (item) => Number(item.price) >= Number(minPrice)
      );
    }

    // MAXIMUM PRICE
    if (maxPrice !== "") {
      result = result.filter(
        (item) => Number(item.price) <= Number(maxPrice)
      );
    }

    // RATING FILTER
    if (rating !== "") {
      result = result.filter(
        (item) => Number(item.rating) >= Number(rating)
      );
    }

    // STOCK FILTER
    if (inStock) {
      result = result.filter(
        (item) => Number(item.stock) > 0
      );
    }

    // SORTING
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
    allProducts,
    searchQuery,
    filters,
    minPrice,
    maxPrice,
    rating,
    inStock,
    sort,
  ]);

  // RESET PAGINATION WHEN FILTERS CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    filters,
    minPrice,
    maxPrice,
    rating,
    inStock,
    sort,
  ]);

  // SCROLL TO TOP WHEN PAGINATION CHANGES
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // PAGINATION
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#100E1B] pt-28">
        <p className="text-purple-400 text-lg">
          Loading consoles and games...
        </p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#100E1B] pt-28">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100E1B] text-white pt-28">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* PAGE HEADING */}
        <div className="mb-8">

          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-2">
            GAME DOCK COLLECTION
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold">
            {searchQuery ? "Search Results" : "Explore All Products"}
          </h1>

          <p className="text-gray-400 mt-3">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : "Discover gaming consoles and games from your favourite brands."}
          </p>

        </div>

        {/* FILTERS */}
        <div className="flex justify-end mb-6">

          <div className="w-full">
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

        </div>

        {/* RESULTS COUNT */}
        <div className="flex items-center justify-between mb-6">

          <p className="text-sm text-gray-400">
            Showing{" "}
            <span className="text-white font-semibold">
              {filteredProducts.length === 0
                ? 0
                : startIndex + 1}
              -
              {Math.min(
                startIndex + productsPerPage,
                filteredProducts.length
              )}
            </span>{" "}
            of{" "}
            <span className="text-white font-semibold">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {paginatedProducts.map((item) => (
              <ProductCard
                key={`${item.itemType}-${item.id}`}
                product={item}
                itemType={item.itemType}
              />
            ))}

          </div>

        ) : (

          <div className="text-center py-20">

            <h2 className="text-xl font-semibold text-white">
              No products found
            </h2>

            <p className="text-gray-400 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Clear Filters
            </button>

          </div>

        )}

        {/* PAGINATION */}
        {totalPages > 1 && (

          <div className="flex flex-wrap items-center justify-center gap-2 mt-10">

            <button
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-[#403650] text-gray-300 hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg border transition ${
                  currentPage === page
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "border-[#403650] text-gray-300 hover:border-purple-500"
                }`}
              >
                {page}
              </button>

            ))}

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-[#403650] text-gray-300 hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>

          </div>

        )}

      </section>

    </div>
  );
}

export default Products;
