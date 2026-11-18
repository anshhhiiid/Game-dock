import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  CalendarDays,
  ShoppingBag,
  Home,
  ArrowRight,
} from "lucide-react";

import { fetchSingleOrder } from "../redux/slices/orderSlice";

function OrderSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentOrder, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchSingleOrder(id));
  }, [dispatch, id]);

  const order =
    currentOrder && String(currentOrder.id) === String(id)
      ? currentOrder
      : null;

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // LOADING
  if (!order && loading) {
    return (
      <div className="min-h-screen bg-[#100E1B] text-white flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your order...</p>
        </div>
      </div>
    );
  }

  // ORDER NOT FOUND
  if (!order) {
    return (
      <div className="min-h-screen bg-[#100E1B] text-white flex items-center justify-center px-4 pt-32">
        <div className="text-center">
          <Package size={55} className="text-gray-500 mx-auto mb-5" />

          <h2 className="text-2xl font-bold mb-3">
            Order Not Found
          </h2>

          <p className="text-gray-400 mb-6">
            {error || "We couldn't find your order details."}
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100E1B] text-white px-4 pt-36 pb-12 md:px-8 md:pt-40">

      <div className="max-w-5xl mx-auto">

        {/* SUCCESS HEADER */}

        <div className="text-center mb-12">

          {/* GREEN CHECKMARK LOGO */}

          <div className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-7 shadow-lg shadow-green-500/10">

            <CheckCircle
              size={58}
              className="text-green-500"
              strokeWidth={2}
            />

          </div>

          <p className="text-green-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Order Confirmed
          </p>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Thank You for Your Order!
          </h1>

          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            Your order has been placed successfully.
            We'll get everything ready for you!
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-[#1A1827] border border-[#30283F] px-5 py-3 rounded-xl">

            <span className="text-gray-400 text-sm">
              Order ID:
            </span>

            <span className="text-purple-400 font-bold">
              #{order.id}
            </span>

          </div>

        </div>

        {/* ORDER INFORMATION */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-5 flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <CalendarDays className="text-purple-400" />
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Order Date
              </p>

              <p className="font-semibold mt-1">
                {formatDate(order.createdAt)}
              </p>
            </div>

          </div>

          <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-5 flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Package className="text-yellow-400" />
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Order Status
              </p>

              <p className="font-semibold mt-1 text-yellow-400">
                {order.orderStatus || "Pending"}
              </p>
            </div>

          </div>

          <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-5 flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CreditCard className="text-green-400" />
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Payment Status
              </p>

              <p className="font-semibold mt-1 text-green-400">
                {order.paymentStatus || "Pending"}
              </p>
            </div>

          </div>

        </div>

        {/* ORDER ITEMS */}

        <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-6 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <ShoppingBag className="text-purple-400" size={22} />

            <h2 className="text-xl font-bold">
              Ordered Products
            </h2>

          </div>

          <div className="space-y-5">

            {order.items?.map((item, index) => (

              <div
                key={`${item.itemType || "item"}-${item.id}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[#30283F] pb-5 last:border-0 last:pb-0"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain bg-[#100E1B] rounded-xl p-2"
                />

                <div className="flex-1">

                  <h3 className="font-semibold text-white">
                    {item.name}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {item.brand || item.category || ""}
                  </p>

                </div>

                <div className="sm:text-right">

                  <p className="text-gray-400 text-sm">
                    Price
                  </p>

                  <p className="text-purple-400 font-bold mt-1">
                    {formatPrice(
                      Number(item.price) * Number(item.quantity)
                    )}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* DELIVERY AND PAYMENT DETAILS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* DELIVERY ADDRESS */}

          <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-5">

              <MapPin className="text-purple-400" size={22} />

              <h2 className="text-lg font-bold">
                Delivery Details
              </h2>

            </div>

            <div className="space-y-3 text-sm">

              <p className="font-semibold text-white">
                {order.customer?.name}
              </p>

              <p className="text-gray-400">
                {order.customer?.phone}
              </p>

              <p className="text-gray-400">
                {order.customer?.email}
              </p>

              <p className="text-gray-400 leading-relaxed">
                {order.customer?.address},
                {" "}{order.customer?.city},
                {" "}{order.customer?.state}
                {" "}- {order.customer?.pincode}
              </p>

            </div>

          </div>

          {/* PAYMENT DETAILS */}

          <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-5">

              <CreditCard className="text-purple-400" size={22} />

              <h2 className="text-lg font-bold">
                Payment Details
              </h2>

            </div>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between gap-3">
                <span className="text-gray-400">
                  Payment Method
                </span>

                <span className="font-semibold text-right">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-400">
                  Payment Status
                </span>

                <span className="text-yellow-400 font-semibold">
                  {order.paymentStatus || "Pending"}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* ORDER SUMMARY */}

        <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-6 mb-8">

          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-400">
                Subtotal
              </span>

              <span>
                {formatPrice(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                Shipping
              </span>

              <span className="text-green-400">
                {Number(order.shipping) === 0
                  ? "FREE"
                  : formatPrice(order.shipping)}
              </span>
            </div>

            <div className="border-t border-[#30283F] pt-4 flex justify-between items-center">

              <span className="text-lg font-bold">
                Total Amount
              </span>

              <span className="text-2xl font-bold text-purple-400">
                {formatPrice(order.total)}
              </span>

            </div>

          </div>

        </div>

        {/* WHAT'S NEXT */}

        <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-6 mb-8">

          <div className="flex items-center gap-3 mb-3">

            <Truck className="text-purple-400" size={24} />

            <h2 className="font-bold text-lg">
              What's Next?
            </h2>

          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Your order is now being processed. We'll prepare
            your items and get them ready for delivery.
            Thank you for shopping with GAME DOCK!
          </p>

        </div>

        {/* ACTION BUTTONS */}

        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-7 py-3.5 rounded-xl font-semibold transition"
          >
            <Home size={18} />
            Back to Home
          </button>

         <button
  onClick={() => navigate("/my-orders")}
  className="flex items-center justify-center gap-2 border border-[#504466] hover:bg-[#211B32] px-7 py-3.5 rounded-xl font-semibold transition"
>
  View My Orders
  <ArrowRight size={18} />
</button>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;
