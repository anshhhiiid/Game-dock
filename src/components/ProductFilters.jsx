import React, { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

function ProductFilters({
  groups,
  filters,
  onChange,
  minPrice,
  maxPrice,
  rating,
  inStock,
  sort,
  onPriceChange,
  onRatingChange,
  onStockChange,
  onSortChange,
  onClear,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full mb-6">

      {/* Compact Filter Button */}
      <div className="flex items-center justify-between flex-wrap gap-3">

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5
          bg-[#1A1827] border border-[#302D40]
          rounded-lg text-white hover:border-purple-500
          transition"
        >
          <SlidersHorizontal size={17} />

          <span className="text-sm font-medium">
            Filters
          </span>

          {isOpen ? (
            <ChevronUp size={17} />
          ) : (
            <ChevronDown size={17} />
          )}
        </button>

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-[#1A1827] border border-[#302D40]
          rounded-lg px-3 py-2.5 text-sm text-white
          outline-none focus:border-purple-500"
        >
          <option value="featured">Featured</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name: A-Z</option>
        </select>

      </div>

      {/* Collapsible Filter Panel */}
      {isOpen && (
        <div className="mt-4 p-5 bg-[#1A1827]
        border border-[#302D40] rounded-xl">

          <div className="grid grid-cols-1 sm:grid-cols-2
          lg:grid-cols-4 gap-6">

            {/* Compact Brand / Platform / Category Filters */}
{groups.map((group) => (
  <div key={group.key} className="col-span-full">

    <h3 className="text-sm font-semibold text-white mb-3">
      {group.label}
    </h3>

    <div className="flex flex-wrap gap-2">

      {group.options.map((option) => {
        const isSelected =
          filters[group.key]?.includes(option) || false;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(group.key, option)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm
              border transition-all duration-200
              ${
                isSelected
                  ? "bg-purple-600/20 border-purple-500 text-purple-300"
                  : "bg-[#11101A] border-[#302D40] text-gray-400 hover:border-purple-500 hover:text-white"
              }`}
          >
            {isSelected && "✓ "}
            {option}
          </button>
        );
      })}

    </div>

  </div>
))}

            {/* Price Filter */}
            <div>
              <h3 className="text-sm font-semibold
              text-white mb-3">
                Price Range
              </h3>

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => onPriceChange("min", e.target.value)}
                  className="w-full min-w-0 bg-[#11101A]
                  border border-[#302D40] rounded-lg
                  px-3 py-2 text-sm text-white outline-none"
                />

                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => onPriceChange("max", e.target.value)}
                  className="w-full min-w-0 bg-[#11101A]
                  border border-[#302D40] rounded-lg
                  px-3 py-2 text-sm text-white outline-none"
                />

              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="text-sm font-semibold
              text-white mb-3">
                Minimum Rating
              </h3>

              <select
                value={rating}
                onChange={(e) => onRatingChange(e.target.value)}
                className="w-full bg-[#11101A]
                border border-[#302D40] rounded-lg
                px-3 py-2 text-sm text-white outline-none"
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <h3 className="text-sm font-semibold
              text-white mb-3">
                Availability
              </h3>

              <label className="flex items-center gap-2
              text-sm text-gray-400 cursor-pointer">

                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => onStockChange(e.target.checked)}
                  className="accent-purple-500"
                />

                In Stock Only

              </label>
            </div>

          </div>

          {/* Clear Filters */}
          <div className="flex justify-end mt-5 pt-4
          border-t border-[#302D40]">

            <button
              onClick={onClear}
              className="text-sm text-purple-400
              hover:text-purple-300 transition"
            >
              Clear All Filters
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ProductFilters;
