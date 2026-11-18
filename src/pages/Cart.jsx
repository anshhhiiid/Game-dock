import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slices/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  
  const cartLoading = useSelector((state) => state.cart.loading);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  const formatPrice = (price) =>
    `₹${Number(price).toLocaleString("en-IN")}`;

  if (cartLoading) {
    return <div className="min-h-screen bg-[#100E1B] flex items-center justify-center pt-24"><p className="text-purple-400">Loading your cart...</p></div>;
  }

  if (cartLoading) {
    return <div className="min-h-screen bg-[#100E1B] flex items-center justify-center pt-24"><p className="text-purple-400">Loading your cart...</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#100E1B] text-white px-4 md:px-8 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center gap-3 mb-8">

          <ShoppingBag size={30} className="text-purple-500" />

          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>

            <p className="text-gray-400 text-sm mt-1">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>

        </div>

        {cartItems.length === 0 ? (

          /* EMPTY CART */

          <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-10 text-center">

            <ShoppingCart
              size={65}
              className="mx-auto text-gray-500 mb-5"
            />

            <h2 className="text-2xl font-bold mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-400 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CART ITEMS */}

            <div className="lg:col-span-2 space-y-5">

              {cartItems.map((item) => {

                const stock = Number(item.stock) || 0;

                return (

                  <div
                    key={`${item.itemType}-${item.id}`}
                    className="bg-[#171426] border border-[#30283F] rounded-2xl p-5 flex flex-col sm:flex-row gap-5"
                  >

                    {/* IMAGE */}

                    <div className="w-full sm:w-36 h-36 bg-[#211D31] rounded-xl flex items-center justify-center p-3">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />

                    </div>

                    {/* PRODUCT DETAILS */}

                    <div className="flex-1">

                      <div className="flex justify-between gap-3">

                        <div>

                          <p className="text-purple-400 text-sm mb-1">
                            {item.brand || item.category || item.itemType}
                          </p>

                          <h2 className="text-lg font-semibold">
                            {item.name}
                          </h2>

                          <p className="text-gray-400 text-sm mt-2">
                            {formatPrice(item.price)}
                          </p>

                        </div>

                        <button
                          onClick={() =>
                            dispatch(
                              removeFromCart({
                                id: item.id,
                                itemType: item.itemType,
                              })
                            )
                          }
                          className="text-gray-400 hover:text-red-500 transition h-fit"
                          title="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>

                      </div>

                      {/* QUANTITY */}

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-5">

                        <div className="flex items-center bg-[#211D31] rounded-lg border border-[#30283F]">

                          <button
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              dispatch(
                                decreaseQuantity({
                                  id: item.id,
                                  itemType: item.itemType,
                                })
                              )
                            }
                            className="p-2 hover:text-purple-400 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="px-4 font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            disabled={item.quantity >= stock}
                            onClick={() =>
                              dispatch(
                                increaseQuantity({
                                  id: item.id,
                                  itemType: item.itemType,
                                })
                              )
                            }
                            className="p-2 hover:text-purple-400 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>

                        </div>

                        <div className="text-right">

                          <p className="text-gray-400 text-xs">
                            Subtotal
                          </p>

                          <p className="text-lg font-bold text-purple-400">
                            {formatPrice(Number(item.price) * item.quantity)}
                          </p>

                        </div>

                      </div>

                      {item.quantity >= stock && stock > 0 && (
                        <p className="text-yellow-500 text-xs mt-2">
                          Maximum available stock reached.
                        </p>
                      )}

                      {stock <= 0 && (
                        <p className="text-red-400 text-xs mt-2">
                          Currently out of stock.
                        </p>
                      )}

                    </div>

                  </div>

                );

              })}

              {/* CONTINUE SHOPPING */}

              <button
                onClick={() => navigate("/products")}
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition"
              >
                <ArrowLeft size={18} />
                Continue Shopping
              </button>

            </div>

            {/* ORDER SUMMARY */}

            <div className="lg:col-span-1">

              <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-6 sticky top-24">

                <h2 className="text-xl font-bold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between text-gray-400">
                    <span>Items ({totalItems})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>

                  <div className="border-t border-[#30283F] pt-4 flex justify-between">

                    <span className="font-semibold text-base">
                      Total
                    </span>

                    <span className="text-xl font-bold text-purple-400">
                      {formatPrice(total)}
                    </span>

                  </div>

                </div>

                {/* CHECKOUT BUTTON */}

                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full mt-7 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
                >
                  Proceed to Checkout
                </button>

                {/* CLEAR CART */}

                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full mt-3 border border-[#30283F] hover:border-red-500 hover:text-red-400 py-3 rounded-xl text-gray-400 transition"
                >
                  Clear Cart
                </button>

                <p className="text-xs text-gray-500 text-center mt-5">
                  Secure checkout • Gaming starts here
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Cart;
