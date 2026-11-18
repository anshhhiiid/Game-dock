import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ArrowLeft, Heart, ShoppingCart, Star, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

import { fetchProducts } from "../redux/slices/productSlice";
import { fetchGames } from "../redux/slices/gameSlice";

import { addToCart } from "../redux/slices/cartSlice";
import { addToWishlist } from "../redux/slices/wishlistSlice";

function ProductDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(1);

  const type = searchParams.get("type");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );

  const { games, loading: gamesLoading } = useSelector(
    (state) => state.games
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const isGame = type === "game";

  // Fetch the required collection
  useEffect(() => {
    if (isGame) {
      dispatch(fetchGames());
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, isGame]);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [id, type]);

  // Find product
  const item = isGame
    ? games.find((game) => String(game.id) === String(id))
    : products.find((product) => String(product.id) === String(id));

  const loading = isGame ? gamesLoading : productsLoading;

  const inStock = item && Number(item.stock) > 0;

  // Wishlist check
  const isWishlisted = item && wishlistItems.some(
    (wishlistItem) =>
      String(wishlistItem.id) === String(item.id) &&
      wishlistItem.itemType === (isGame ? "game" : "product")
  );

  // Add to cart
  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!inStock) return;

    const alreadyInCart = cartItems.some(
      (cartItem) =>
        String(cartItem.id) === String(item.id) &&
        cartItem.itemType === (isGame ? "game" : "product")
    );

    if (alreadyInCart) {
      toast("This item is already in your cart.", { icon: "🛒" });
      return;
    }

    dispatch(
      addToCart({
        product: item,
        itemType: isGame ? "game" : "product",
        quantity,
      })
    )
      .unwrap()
      .then(() => toast.success(`${quantity} × ${item.name} added to cart.`))
      .catch((error) => toast.error(error || "Could not update your cart."));
  };

  // Add to wishlist
  const handleAddToWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(
      addToWishlist({
        product: item,
        itemType: isGame ? "game" : "product",
      })
    )
      .unwrap()
      .then(() => toast.success(`${item.name} added to wishlist.`))
      .catch((error) => toast.error(error || "Could not update your wishlist."));
  };

  // Loading
  if (loading && !item) {
    return (
      <div className="min-h-screen bg-[#100E1B] flex items-center justify-center">
        <p className="text-purple-400 text-lg">
          Loading details...
        </p>
      </div>
    );
  }

  // Not found
  if (!item) {
    return (
      <div className="min-h-screen bg-[#100E1B] text-white flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold">
          Product Not Found
        </h2>

        <p className="text-gray-400 mt-3">
          This item could not be found in our collection.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100E1B] text-white">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400
          hover:text-purple-400 transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Collection
        </button>

        {/* Main Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Image */}
          <div className="bg-[#171426] border border-[#30283F]
          rounded-2xl overflow-hidden flex items-center justify-center p-6">

            <img
              src={item.image}
              alt={item.name}
              className="w-full max-h-[500px] object-contain"
            />

          </div>

          {/* Information */}
          <div className="flex flex-col justify-center">

            <p className="text-purple-400 uppercase tracking-widest text-sm font-semibold">
              {isGame ? "GAME COLLECTION" : "CONSOLE COLLECTION"}
            </p>

            <p className="text-gray-400 mt-3">
              {item.brand}
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              {item.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-5">

              <Star
                size={20}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="text-yellow-400 font-semibold">
                {item.rating || "New"}
              </span>

              <span className="text-gray-500 text-sm">
                Customer Rating
              </span>

            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-white mt-7">
              ₹{Number(item.price).toLocaleString("en-IN")}
            </p>

            {/* Stock */}
            <div className="mt-5">

              {inStock ? (
                <p className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={17} />
                  In Stock ({item.stock} available)
                </p>
              ) : (
                <p className="text-red-400 text-sm">
                  Currently Out of Stock
                </p>
              )}

            </div>

            {/* QUANTITY SELECTION */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Quantity</p>

              <div className="inline-flex items-center bg-[#171426] border border-[#30283F] rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  className="px-4 py-2 text-lg hover:text-purple-400 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="min-w-10 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(Number(item.stock) || 1, value + 1))}
                  disabled={!inStock || quantity >= Number(item.stock)}
                  className="px-4 py-2 text-lg hover:text-purple-400 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {inStock && (
                <p className="text-xs text-gray-500 mt-2">
                  Maximum {item.stock} per order.
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mt-7">

              <h2 className="text-lg font-semibold mb-3">
                Product Description
              </h2>

              <p className="text-gray-400 leading-7">
                {item.description ||
                  `${item.name} from ${item.brand}. Explore its features and enjoy your gaming experience.`}
              </p>

            </div>

            {/* Game Information */}
            {isGame && (
              <div className="mt-7 grid grid-cols-2 gap-4">

                <div className="bg-[#171426] border border-[#30283F] p-4 rounded-xl">
                  <p className="text-gray-500 text-sm">
                    Platform
                  </p>

                  <p className="text-white font-semibold mt-2">
                    {item.platform || "Not specified"}
                  </p>
                </div>

                <div className="bg-[#171426] border border-[#30283F] p-4 rounded-xl">
                  <p className="text-gray-500 text-sm">
                    Genre
                  </p>

                  <p className="text-white font-semibold mt-2">
                    {item.category || "Not specified"}
                  </p>
                </div>

              </div>
            )}

            {/* Console Specifications */}
            {!isGame && item.specifications && (
              <div className="mt-7">

                <h2 className="text-lg font-semibold mb-4">
                  Technical Specifications
                </h2>

                <div className="bg-[#171426] border border-[#30283F] rounded-xl overflow-hidden">

                  {Object.entries(item.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between gap-4
                        p-4 border-b border-[#30283F] last:border-0"
                      >

                        <span className="text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>

                        <span className="text-white text-right font-medium">
                          {value}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-2
                bg-purple-600 hover:bg-purple-700
                disabled:bg-gray-600 disabled:cursor-not-allowed
                px-6 py-4 rounded-xl font-semibold transition"
              >
                <ShoppingCart size={20} />

                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>

              <button
                onClick={handleAddToWishlist}
                className="flex items-center justify-center gap-2
                border border-[#403650] hover:border-purple-500
                px-6 py-4 rounded-xl transition"
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                />

                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ProductDetails;
