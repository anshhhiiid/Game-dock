import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import {
  Package,
  ShoppingBag,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import { fetchUserOrders } from "../redux/slices/orderSlice";

function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const user = useSelector((state) => state.auth.user);

  const {
    orders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  // Fetch logged-in user's orders
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    dispatch(fetchUserOrders(user.id));
  }, [user, dispatch, navigate]);

  // Format price
  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500/10 text-green-400";

      case "cancelled":
        return "bg-red-500/10 text-red-400";

      case "shipped":
        return "bg-blue-500/10 text-blue-400";

      default:
        return "bg-yellow-500/10 text-yellow-400";
    }
  };

  // Loading
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#100E1B] flex items-center justify-center pt-28">
        <p className="text-purple-400 text-lg">
          Loading your orders...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-[#100E1B] flex items-center justify-center pt-28">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100E1B] text-white pt-28 px-4 sm:px-6">

      <div className="max-w-6xl mx-auto py-12">

        {/* Heading */}
        <div className="mb-10">

          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-2">
            YOUR ACCOUNT
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold">
            My Orders
          </h1>

          <p className="text-gray-400 mt-3">
            Track and manage your purchases.
          </p>

        </div>

        {/* Order Count */}
        <div className="flex items-center gap-3 mb-8">

          <Package className="text-purple-400" size={22} />

          <p className="text-gray-400">
            You have{" "}
            <span className="text-white font-semibold">
              {orders.length}
            </span>{" "}
            orders
          </p>

        </div>

        {/* Empty Orders */}
        {orders.length === 0 ? (

          <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-10 text-center">

            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag
                size={30}
                className="text-purple-400"
              />
            </div>

            <h2 className="text-xl font-semibold mb-2">
              No Orders Yet
            </h2>

            <p className="text-gray-400 mb-6">
              You haven't placed any orders yet.
              Start exploring our collection!
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>

          </div>

        ) : (

          /* Orders List */
          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-[#171426] border border-[#30283F] rounded-2xl overflow-hidden"
              >

                {/* Order Header */}
                <div className="p-5 sm:p-6 border-b border-[#30283F]">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                      <p className="text-gray-400 text-sm">
                        Order ID
                      </p>

                      <p className="font-semibold mt-1 break-all">
                        #{order.id}
                      </p>

                    </div>

                    <div>

                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <CalendarDays size={15} />
                        Order Date
                      </p>

                      <p className="font-medium mt-1">
                        {formatDate(order.createdAt)}
                      </p>

                    </div>

                    <div>

                      <p className="text-gray-400 text-sm mb-2">
                        Order Status
                      </p>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}
                      >
                        {order.orderStatus || "Pending"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Order Items */}
                <div className="p-5 sm:p-6 space-y-4">

                  {order.items?.map((item, index) => (

                    <div
                      key={`${item.itemType}-${item.id}-${index}`}
                      className="flex items-center gap-4"
                    >

                      <div className="w-16 h-16 bg-[#100E1B] rounded-xl flex items-center justify-center overflow-hidden shrink-0">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />

                      </div>

                      <div className="flex-1 min-w-0">

                        <h3 className="font-medium truncate">
                          {item.name}
                        </h3>

                        <p className="text-gray-400 text-sm mt-1">
                          Quantity: {item.quantity}
                        </p>

                        <p className="text-purple-400 text-sm mt-1">
                          {item.itemType === "game"
                            ? "Game"
                            : "Console"}
                        </p>

                      </div>

                      <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
                        {formatPrice(
                          Number(item.price) * Number(item.quantity)
                        )}
                      </p>

                    </div>

                  ))}

                </div>

                {/* Order Footer */}
                <div className="bg-[#100E1B]/60 border-t border-[#30283F] p-5 sm:p-6">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                      <p className="text-gray-400 text-sm">
                        Payment Method: {order.paymentMethod}
                      </p>

                      <p className="text-gray-400 text-sm mt-1">
                        Payment Status: {order.paymentStatus}
                      </p>

                    </div>

                    <div className="sm:text-right">

                      <p className="text-gray-400 text-sm">
                        Total Amount
                      </p>

                      <p className="text-xl font-bold text-purple-400 mt-1">
                        {formatPrice(order.total)}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyOrders;