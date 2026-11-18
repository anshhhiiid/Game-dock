import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ShoppingBag,
  MapPin,
  CreditCard,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { placeOrder, clearOrderMessages } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // REDUX STATE

  const { user } = useSelector((state) => state.auth);

  const cartItems = useSelector((state) => state.cart.items);
  const cartLoading = useSelector((state) => state.cart.loading);

  const { loading, success: orderSuccess } = useSelector(
    (state) => state.orders
  );

  // FORM STATE

  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Reset the previous checkout result whenever this page is opened again.
  useEffect(() => {
    dispatch(clearOrderMessages());
  }, [dispatch]);

  // REDIRECT WHEN CHECKOUT INITIALLY OPENS

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (!cartLoading && cartItems.length === 0 && !orderSuccess) {
      navigate("/cart", { replace: true });
    }
  }, [user, cartLoading, cartItems.length, orderSuccess, navigate]);

  // CALCULATE TOTAL

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  // FORMAT PRICE

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // HANDLE INPUT CHANGES

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // PLACE ORDER

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login before placing an order.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
      return;
    }

    // VALIDATE CUSTOMER DETAILS

    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const emptyField = requiredFields.find(
      (field) => !String(formData[field]).trim()
    );

    if (emptyField) {
      toast.error("Please fill in all delivery details.");
      return;
    }

    // VALIDATE PHONE NUMBER

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      toast.error("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    // VALIDATE PINCODE

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      toast.error("Enter a valid 6-digit pincode.");
      return;
    }

    // VALIDATE STOCK

    const outOfStockItem = cartItems.find((item) => {
      const stock = Number(item.stock);

      return (
        !Number.isFinite(stock) ||
        stock <= 0 ||
        Number(item.quantity) > stock
      );
    });

    if (outOfStockItem) {
      toast.error(
        `${outOfStockItem.name} has insufficient stock.`
      );
      return;
    }

    // CREATE ORDER DATA

    const orderData = {
      userId: user.id,

      customer: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      },

      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
        itemType: item.itemType,
      })),

      subtotal,
      shipping,
      total,

      paymentMethod,

      // UPI is only a demo option currently.
      // No actual payment gateway is connected.

      paymentStatus: "Pending",
      orderStatus: "Pending",

      createdAt: new Date().toISOString(),
    };

    // SEND ORDER TO JSON SERVER

    try {
      const result = await dispatch(placeOrder(orderData));

      if (placeOrder.fulfilled.match(result)) {
        // CLEAR CART AFTER SUCCESSFUL ORDER

        try {
          await dispatch(clearCart()).unwrap();
        } catch {
          toast.error("Order was placed, but the cart could not be cleared. Please refresh your cart.");
        }

        toast.success("Order placed successfully!");

        // NAVIGATE TO ORDER SUCCESS PAGE

        navigate(
          `/order-success/${result.payload.id}`,
          { replace: true }
        );

      } else {
        toast.error(
          result.payload || "Failed to place your order."
        );
      }

    } catch (error) {
      console.error("Order placement error:", error);

      toast.error("Something went wrong. Please try again.");
    }
  };

  // PREVENT CHECKOUT CONTENT FROM FLASHING DURING REDIRECT

  if (!user) return null;

  if (cartLoading) {
    return <div className="min-h-screen bg-[#100E1B] flex items-center justify-center"><p className="text-purple-400">Loading checkout...</p></div>;
  }

  if (cartItems.length === 0 && !orderSuccess) return null;

  return (
    <div className="min-h-screen bg-[#100E1B] text-white px-4 py-10 md:px-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-5 transition"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <h1 className="text-3xl md:text-4xl font-bold">
            Checkout
          </h1>

          <p className="text-gray-400 mt-2">
            Complete your details and place your order.
          </p>

        </div>

        <form onSubmit={handlePlaceOrder}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT SECTION */}

            <div className="lg:col-span-2 space-y-7">

              {/* DELIVERY INFORMATION */}

              <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-6">

                  <MapPin
                    className="text-purple-400"
                    size={23}
                  />

                  <h2 className="text-xl font-bold">
                    Delivery Information
                  </h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* NAME */}

                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full bg-[#211D31] border border-[#39314B] rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-[#211D31] border border-[#39314B] rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                    />

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      Mobile Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                      className="w-full bg-[#211D31] border border-[#39314B] rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                    />

                  </div>

                  {/* PINCODE */}

                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      required
                      className="w-full bg-[#211D31] border border-[#39314B] rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                    />

                  </div>

                  {/* ADDRESS */}

                  <div className="md:col-span-2">

                    <label className="block text-sm text-gray-400 mb-2">
                      Full Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number, street, landmark..."
                      rows={3}
                      required
                      className="w-full bg-[#211D31] border border-[#39314B] rounded-xl px-4 py-3 outline-none focus:border-purple-500 resize-none"
                    />

                  </div>

                  {/* CITY */}

                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      required
                      className="w-full bg-[#211D31] border border-[#39314B] rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                    />

                  </div>

                  {/* STATE */}

                  <div>

                    <label className="block text-sm text-gray-400 mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      required
                      className="w-full bg-[#211D31] border border-[#39314B] rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                    />

                  </div>

                </div>

              </div>

              {/* PAYMENT METHOD */}

              <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-6">

                  <CreditCard
                    className="text-purple-400"
                    size={23}
                  />

                  <h2 className="text-xl font-bold">
                    Payment Method
                  </h2>

                </div>

                <div className="space-y-4">

                  {/* CASH ON DELIVERY */}

                  <label className="flex items-center gap-4 bg-[#211D31] border border-[#39314B] rounded-xl p-4 cursor-pointer hover:border-purple-500 transition">

                    <input
                      type="radio"
                      name="payment"
                      value="Cash on Delivery"
                      checked={
                        paymentMethod === "Cash on Delivery"
                      }
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="accent-purple-500"
                    />

                    <div>

                      <p className="font-semibold">
                        Cash on Delivery
                      </p>

                      <p className="text-gray-400 text-sm">
                        Pay when your order arrives.
                      </p>

                    </div>

                  </label>

                  {/* UPI */}

                  <label className="flex items-center gap-4 bg-[#211D31] border border-[#39314B] rounded-xl p-4 cursor-pointer hover:border-purple-500 transition">

                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="accent-purple-500"
                    />

                    <div>

                      <p className="font-semibold">
                        UPI
                      </p>

                      <p className="text-gray-400 text-sm">
                        Demo selection only. Online payment is not connected yet.
                      </p>

                    </div>

                  </label>

                </div>

              </div>

            </div>

            {/* RIGHT SECTION */}

            <div>

              <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-6 sticky top-24">

                <div className="flex items-center gap-3 mb-6">

                  <ShoppingBag
                    className="text-purple-400"
                    size={23}
                  />

                  <h2 className="text-xl font-bold">
                    Order Summary
                  </h2>

                </div>

                {/* CART ITEMS */}

                <div className="space-y-5 max-h-80 overflow-y-auto pr-2">

                  {cartItems.map((item) => (

                    <div
                      key={`${item.itemType}-${item.id}`}
                      className="flex items-center gap-4"
                    >

                      <div className="w-16 h-16 bg-[#211D31] rounded-xl p-2 shrink-0">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />

                      </div>

                      <div className="flex-1 min-w-0">

                        <h3 className="font-semibold text-sm truncate">
                          {item.name}
                        </h3>

                        <p className="text-gray-400 text-xs mt-1">
                          Quantity: {item.quantity}
                        </p>

                        <p className="text-purple-400 text-sm font-semibold mt-1">
                          {formatPrice(
                            Number(item.price) * item.quantity
                          )}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

                {/* PRICE DETAILS */}

                <div className="border-t border-[#30283F] mt-6 pt-5 space-y-4">

                  <div className="flex justify-between text-gray-400 text-sm">

                    <span>Subtotal</span>

                    <span>{formatPrice(subtotal)}</span>

                  </div>

                  <div className="flex justify-between text-gray-400 text-sm">

                    <span>Shipping</span>

                    <span className="text-green-400">
                      FREE
                    </span>

                  </div>

                  <div className="border-t border-[#30283F] pt-4 flex justify-between">

                    <span className="font-bold text-lg">
                      Total
                    </span>

                    <span className="font-bold text-xl text-purple-400">
                      {formatPrice(total)}
                    </span>

                  </div>

                </div>

                {/* PLACE ORDER BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-7 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
                >
                  {loading
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

                {/* SECURITY MESSAGE */}

                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-5">

                  <ShieldCheck size={16} />

                  <span>
                    Secure checkout experience
                  </span>

                </div>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Checkout;