import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistLoading = useSelector((state) => state.wishlist.loading);

  if (wishlistLoading) {
    return <div className="min-h-screen bg-[#100E1B] flex items-center justify-center text-purple-400">Loading your wishlist...</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#100E1B] flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">
          Your Wishlist is Empty
        </h1>

        <p className="text-gray-400">
          Save your favourite gaming products here.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100E1B] text-white px-6 md:px-16 py-12">

      <h1 className="text-3xl font-bold mb-10">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {wishlistItems.map((item) => (

          <div
            key={`${item.itemType}-${item.id}`}
            className="bg-[#171426] border border-[#30283F] rounded-2xl overflow-hidden hover:border-purple-500 transition"
          >

            <div className="h-56 bg-[#20202C] p-4">

              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain"
              />

            </div>

            <div className="p-5">

              <p className="text-purple-400 text-sm">
                {item.brand || item.itemType}
              </p>

              <h2 className="text-lg font-bold mt-2">
                {item.name}
              </h2>

              <p className="text-white text-xl font-bold mt-3">
                ₹{Number(item.price).toLocaleString("en-IN")}
              </p>

              <button
                onClick={() => {
                  dispatch(addToCart({ product: item, itemType: item.itemType }))
                    .unwrap()
                    .then(() => {
                      dispatch(removeFromWishlist({ id: item.id, itemType: item.itemType }));
                      toast.success("Item moved to cart.");
                    })
                    .catch((error) => toast.error(error || "Could not move item to cart."));
                }}
                className="w-full mt-5 bg-gradient-to-r from-violet-600 to-purple-600 py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
              >
                Add to Cart
              </button>

              <button
                onClick={() =>
                  dispatch(
                    removeFromWishlist({
                      id: item.id,
                      itemType: item.itemType,
                    })
                  )
                }
                className="w-full mt-3 border border-red-500/40 text-red-400 py-3 rounded-xl hover:bg-red-500/10 transition"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}

export default Wishlist;
