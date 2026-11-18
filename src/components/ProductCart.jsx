import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Heart, ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";

import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist } from "../redux/slices/wishlistSlice";

function ProductCart({ product, itemType = "product" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // CHECK WISHLIST
  const isWishlisted = wishlistItems.some(
    (item) =>
      String(item.id) === String(product.id) &&
      item.itemType === itemType
  );

  // ADD TO CART
  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const stock = Number(product.stock) || 0;

    if (stock <= 0) {
      toast.error("This product is out of stock!");
      return;
    }

    const existingItem = cartItems.find(
      (item) =>
        String(item.id) === String(product.id) &&
        item.itemType === itemType
    );

    if (existingItem) {
      toast("This product is already in your cart!", {
        icon: "🛒",
      });
      return;
    }

    dispatch(addToCart({ product, itemType }))
      .unwrap()
      .then(() => toast.success(`${product.name} added to cart!`))
      .catch((error) => toast.error(error || "Could not update your cart."));
  };

  // ADD TO WISHLIST
  const handleAddToWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      toast("Already in your wishlist!", {
        icon: "❤️",
      });
      return;
    }

    dispatch(addToWishlist({ product, itemType }))
      .unwrap()
      .then(() => toast.success(`${product.name} added to wishlist!`))
      .catch((error) => toast.error(error || "Could not update your wishlist."));
  };

  // VIEW DETAILS
  const handleViewDetails = () => {
    const type = itemType === "game" ? "game" : "console";

    navigate(`/product/${product.id}?type=${type}`);
  };

  if (!product) return null;

  return (
    <div
      className="bg-[#1A1827] border border-[#292638]
      rounded-xl overflow-hidden group
      hover:border-purple-500/60 transition duration-300"
    >
      {/* IMAGE */}
      <div className="relative h-64 bg-[#111111] overflow-hidden">

        <button
          type="button"
          onClick={handleViewDetails}
          className="w-full h-full"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-3
            group-hover:scale-105 transition duration-500"
          />
        </button>

        {/* WISHLIST BUTTON */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-3 right-3 p-2
          bg-black/60 rounded-full
          hover:bg-purple-600 transition"
          aria-label="Add to wishlist"
        >
          <Heart
            size={18}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-white"
            }
          />
        </button>

      {/* STOCK STATUS */}
{Number(product.stock) <= 0 ? (
  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
    Out of Stock
  </span>
) : Number(product.stock) <= 3 ? (
  <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-3 py-1 rounded-full">
    Only {product.stock} left!
  </span>
) : null}

      </div>

      {/* PRODUCT DETAILS */}
      <div className="p-4">

        <p className="text-purple-400 text-xs font-semibold uppercase">
          {product.brand}
        </p>

        <button
          onClick={handleViewDetails}
          className="text-left text-white font-semibold
          text-lg mt-2 line-clamp-1
          hover:text-purple-400 transition"
        >
          {product.name}
        </button>

        {/* CATEGORY */}
        <p className="text-gray-400 text-sm mt-1">
          {product.category}
        </p>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-3">

          <Star
            size={15}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="text-sm text-gray-300">
            {product.rating || "N/A"}
          </span>

        </div>

        {/* PRICE */}
        <p className="text-xl font-bold text-white mt-4">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>

        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          disabled={Number(product.stock) <= 0}
          className="w-full mt-4 flex items-center
          justify-center gap-2 py-2.5 rounded-lg
          bg-purple-600 hover:bg-purple-700
          disabled:bg-gray-600 disabled:cursor-not-allowed
          text-white text-sm font-semibold transition"
        >
          <ShoppingCart size={17} />

          {Number(product.stock) <= 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>

      </div>
    </div>
  );
}

export default ProductCart;
