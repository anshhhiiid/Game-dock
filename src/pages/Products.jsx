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

  // Redux data
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

  // Combined loading and error states
  const loading = productsLoading || gamesLoading;
  const error = productsError || gamesError;

  // Filter states
  const [filters, setFilters] = useState({
    brand: selectedBrand ? [selectedBrand] : [],
    category: [],
  });

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");

  // Fetch consoles and games
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchGames());
  }, [dispatch]);

  // Update brand filter when URL changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      brand: selectedBrand ? [selectedBrand] : [],
    }));
  }, [selectedBrand]);

  // Normalize search
  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[\s-]+/g, "");

  // Combine consoles and games
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

  // Available brands from both collections
  const brands = useMemo(
    () => [
      ...new Set(
        allProducts.map((item) => item.brand).filter(Boolean)
      ),
    ],
    [allProducts]
  );

  // Available categories from both collections
  const categories = useMemo(
    () => [
      ...new Set(
        allProducts.map((item) => item.category).filter(Boolean)
      ),
    ],
    [allProducts]
  );

  // Filter groups
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

  // Handle brand and category filters
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  // Handle price changes
  const handlePriceChange = (type, value) => {
    if (type === "min") {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
  };

  // Clear filters
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

  // Filter and sort consoles + games
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
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

    // Brand filter
    if (filters.brand.length > 0) {
      result = result.filter((item) =>
        filters.brand.includes(item.brand)
      );
    }

    // Category filter
    if (filters.category.length > 0) {
      result = result.filter((item) =>
        filters.category.includes(item.category)
      );
    }

    // Minimum price
    if (minPrice !== "") {
      result = result.filter(
        (item) => Number(item.price) >= Number(minPrice)
      );
    }

    // Maximum price
    if (maxPrice !== "") {
      result = result.filter(
        (item) => Number(item.price) <= Number(maxPrice)
      );
    }

    // Rating filter
    if (rating !== "") {
      result = result.filter(
        (item) => Number(item.rating) >= Number(rating)
      );
    }

    // Stock filter
    if (inStock) {
      result = result.filter(
        (item) => Number(item.stock) > 0
      );
    }

    // Sorting
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

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#100E1B] pt-28">
        <p className="text-purple-400 text-lg">
          Loading consoles and games...
        </p>
      </div>
    );
  }

  // Error
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

        {/* Page Heading */}
        <div className="mb-8">

          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-2">
            GAME DOCK COLLECTION
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold">
            {searchQuery
              ? "Search Results"
              : "Explore All Products"}
          </h1>

          <p className="text-gray-400 mt-3">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : "Discover gaming consoles and games from your favourite brands."}
          </p>

        </div>

        {/* Filters */}
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

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">

          <p className="text-sm text-gray-400">
            Showing{" "}
            <span className="text-white font-semibold">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredProducts.map((item) => (
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

      </section>

    </div>
  );
}

export default Products;
