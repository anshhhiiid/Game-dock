import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdminProducts,
  fetchAdminUsers,
  fetchAdminOrders,
} from "../../../redux/slices/adminSlice";

import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products, users, orders, loading } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <div className="p-5 md:p-8 text-white">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome to your GAME DOCK administration panel.
        </p>
      </div>

      {loading && (
        <p className="text-gray-400 mb-5">Loading dashboard data...</p>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-[#151b27] border border-gray-800 p-6 rounded-xl"
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-gray-400 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-2xl font-bold mt-3">
                    {item.value}
                  </h2>
                </div>

                <div className="bg-red-500/10 p-3 rounded-lg">
                  <Icon className="text-red-500" size={25} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* RECENT ORDERS */}

      <div className="mt-10 bg-[#151b27] border border-gray-800 rounded-xl overflow-hidden">

        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold">
            Recent Orders
          </h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No orders available.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left min-w-[650px]">

              <thead className="bg-[#0d121d] text-gray-400 text-sm">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-800"
                  >
                    <td className="p-4 text-sm">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      {order.customer?.name || "Unknown"}
                    </td>

                    <td className="p-4">
                      ₹{Number(order.total || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs">
                        {order.orderStatus || "Pending"}
                      </span>
                    </td>

                    <td className="p-4 text-gray-400 text-sm">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;