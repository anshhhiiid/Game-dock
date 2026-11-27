import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchAdminOrders,
  fetchAdminOrderDetails,
  clearSelectedOrder,
  changeAdminOrderStatus,
} from "../../../redux/slices/adminSlice";

import {
  Search,
  Eye,
  X,
  Package,
  MapPin,
  CreditCard,
} from "lucide-react";

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const dispatch = useDispatch();

  const {
    orders,
    selectedOrder,
    loading,
  } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const itemsPerPage = 8;

  // FETCH ORDERS

  useEffect(() => {
    dispatch(fetchAdminOrders());

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch]);

  // SEARCH ORDERS

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName = order.customer?.name || "";
      const customerEmail = order.customer?.email || "";

      const searchText =
        `${order.id} ${customerName} ${customerEmail}`.toLowerCase();

      return searchText.includes(search.toLowerCase());
    });
  }, [orders, search]);

  // PAGINATION

  const totalPages = Math.ceil(
    filteredOrders.length / itemsPerPage
  );

  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // VIEW ORDER DETAILS

  const handleViewDetails = async (id) => {
    try {
      await dispatch(fetchAdminOrderDetails(id)).unwrap();
      setShowDetails(true);
    } catch (error) {
      toast.error(error || "Unable to load order details");
    }
  };

  // CLOSE MODAL

  const closeDetails = () => {
    setShowDetails(false);
    dispatch(clearSelectedOrder());
  };

  // UPDATE ORDER STATUS

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingOrderId(id);

      const updatedOrder = await dispatch(
        changeAdminOrderStatus({
          id,
          orderStatus: newStatus,
        })
      ).unwrap();

      await dispatch(fetchAdminOrders()).unwrap();

      if (
        showDetails &&
        String(selectedOrder?.id) === String(id)
      ) {
        await dispatch(fetchAdminOrderDetails(id)).unwrap();
      }

      toast.success(
        `Order #${id} updated to ${updatedOrder.orderStatus}`
      );
    } catch (error) {
      console.error("Order status update error:", error);

      toast.error(
        typeof error === "string"
          ? error
          : "Unable to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // STATUS COLORS

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500/10 text-green-400";

      case "cancelled":
        return "bg-red-500/10 text-red-400";

      case "shipped":
        return "bg-blue-500/10 text-blue-400";

      case "processing":
        return "bg-purple-500/10 text-purple-400";

      default:
        return "bg-yellow-500/10 text-yellow-400";
    }
  };

  // STATUS DROPDOWN

  const StatusSelect = ({ order }) => (
    <select
      value={order.orderStatus || "Pending"}
      disabled={String(updatingOrderId) === String(order.id)}
      onChange={(e) =>
        handleStatusChange(order.id, e.target.value)
      }
      className={`rounded-lg border border-[#33303a] bg-[#101014] px-3 py-2 text-xs outline-none focus:border-purple-500 disabled:opacity-50 ${getStatusStyle(
        order.orderStatus
      )}`}
    >
      {ORDER_STATUSES.map((status) => (
        <option
          key={status}
          value={status}
          className="bg-[#151519] text-white"
        >
          {status}
        </option>
      ))}
    </select>
  );

  return (
    <div className="p-5 md:p-8 text-white">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="text-gray-400 mt-2">
          View and manage customer orders.
        </p>
      </div>

      {/* ORDER COUNT */}

      <div className="bg-[#151519] border border-[#29252f] p-5 rounded-xl mb-6 flex items-center gap-4">
        <div className="bg-purple-500/10 p-3 rounded-lg">
          <Package size={25} className="text-purple-400" />
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            Total Orders
          </p>

          <h2 className="text-2xl font-bold">
            {orders.length}
          </h2>
        </div>
      </div>

      {/* SEARCH */}

      <div className="relative mb-6 max-w-md">
        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={20}
        />

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by order ID or customer..."
          className="w-full bg-[#151519] border border-[#33303a] rounded-lg pl-11 pr-4 py-3 outline-none focus:border-purple-500 transition"
        />
      </div>

      {/* ORDERS TABLE */}

      <div className="bg-[#151519] border border-[#29252f] rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-gray-400">
            Loading orders...
          </p>
        ) : filteredOrders.length === 0 ? (
          <p className="p-10 text-center text-gray-400">
            No orders found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-[#101014] text-gray-400 text-sm">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {displayedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#29252f] hover:bg-purple-500/[0.03] transition"
                  >
                    <td className="p-4 text-sm">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      <p className="font-medium">
                        {order.customer?.name || "Unknown"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {order.customer?.email || "N/A"}
                      </p>
                    </td>

                    <td className="p-4">
                      {order.items?.length || 0}
                    </td>

                    <td className="p-4 font-medium">
                      ₹
                      {Number(order.total || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4 text-sm">
                      {order.paymentMethod || "N/A"}
                    </td>

                    <td className="p-4">
                      <StatusSelect order={order} />
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
                      >
                        <Eye size={18} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="px-4 py-2 bg-[#151519] border border-[#29252f] rounded-lg hover:border-purple-500/40 transition disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="px-4 py-2 bg-[#151519] border border-[#29252f] rounded-lg hover:border-purple-500/40 transition disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}

      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#151519] border border-[#33303a] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Order Details
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Order #{selectedOrder.id}
                </p>
              </div>

              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* CUSTOMER DETAILS */}

            <div className="bg-[#101014] rounded-lg p-5 mb-5">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <MapPin size={19} className="text-purple-400" />
                Customer Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="text-gray-400">Name: </span>
                  {selectedOrder.customer?.name || "N/A"}
                </p>

                <p>
                  <span className="text-gray-400">Email: </span>
                  {selectedOrder.customer?.email || "N/A"}
                </p>

                <p>
                  <span className="text-gray-400">Phone: </span>
                  {selectedOrder.customer?.phone || "N/A"}
                </p>

                <p>
                  <span className="text-gray-400">Pincode: </span>
                  {selectedOrder.customer?.pincode || "N/A"}
                </p>

                <p className="sm:col-span-2">
                  <span className="text-gray-400">Address: </span>

                  {[
                    selectedOrder.customer?.address,
                    selectedOrder.customer?.city,
                    selectedOrder.customer?.state,
                    selectedOrder.customer?.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </p>
              </div>
            </div>

            {/* ORDERED ITEMS */}

            <div className="mb-5">
              <h3 className="font-semibold mb-4">
                Ordered Items
              </h3>

              <div className="space-y-3">
                {(selectedOrder.items || []).map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-4 bg-[#101014] rounded-lg p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded bg-white/5"
                    />

                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.name}
                      </h4>

                      <p className="text-gray-400 text-sm">
                        {item.itemType === "game" ? "Game" : "Product"}
                      </p>

                      <p className="text-gray-400 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* PAYMENT DETAILS */}

            <div className="bg-[#101014] rounded-lg p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <CreditCard size={19} className="text-purple-400" />
                Payment Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>

                  <span>
                    ₹
                    {Number(selectedOrder.subtotal || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>

                  <span>
                    ₹
                    {Number(selectedOrder.shipping || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-lg border-t border-[#33303a] pt-3">
                  <span>Total</span>

                  <span className="text-purple-400">
                    ₹
                    {Number(selectedOrder.total || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method</span>

                  <span>
                    {selectedOrder.paymentMethod || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Status</span>

                  <span>
                    {selectedOrder.paymentStatus || "Pending"}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-4 border-t border-[#33303a] pt-3">
                  <span className="text-gray-400">
                    Order Status
                  </span>

                  <StatusSelect order={selectedOrder} />
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Order Date</span>

                  <span>
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;