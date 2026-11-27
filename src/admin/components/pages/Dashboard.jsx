import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdminProducts,
  fetchAdminGames,
  fetchAdminUsers,
  fetchAdminOrders,
} from "../../../redux/slices/adminSlice";

import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Activity,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ==============================
// CONSTANTS
// ==============================

const STATUS_COLORS = {
  Pending: "#F59E0B",
  Processing: "#3B82F6",
  Shipped: "#A855F7",
  Delivered: "#22C55E",
  Cancelled: "#EF4444",
};

const STATUS_LIST = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// ==============================
// ORDER STATUS STYLE
// ==============================

const getOrderStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";

    case "processing":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";

    case "shipped":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";

    case "delivered":
      return "bg-green-500/10 text-green-400 border border-green-500/20";

    case "cancelled":
      return "bg-red-500/10 text-red-400 border border-red-500/20";

    default:
      return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
  }
};

// ==============================
// HELPERS
// ==============================

const getValidDate = (date) => {
  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

// ==============================
// REVENUE ELIGIBILITY
// ==============================

const isRevenueOrder = (order) => {
  const status = order.orderStatus?.toLowerCase();
  const paymentStatus = order.paymentStatus?.toLowerCase();

  if (status === "cancelled") return false;

  return paymentStatus === "paid";
};

// ==============================
// CUSTOM TOOLTIP
// ==============================

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#100E1B] border border-purple-500/30 rounded-xl p-3 shadow-2xl min-w-[145px]">
      <p className="text-gray-400 text-xs mb-2">
        {label}
      </p>

      {payload.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 mb-1.5 last:mb-0"
        >
          <span className="text-gray-300 text-xs">
            {item.name}
          </span>

          <span className="text-white font-semibold text-xs">
            {item.dataKey === "revenue"
              ? formatCurrency(item.value)
              : `${item.value} orders`}
          </span>
        </div>
      ))}
    </div>
  );
};

// ==============================
// DASHBOARD
// ==============================

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    products,
    games,
    users,
    orders,
    loading,
  } = useSelector((state) => state.admin);

  const [dateRange, setDateRange] = useState("7");

  // ==============================
  // FETCH DASHBOARD DATA
  // ==============================

  useEffect(() => {
    const fetchDashboardData = () => {
      dispatch(fetchAdminProducts());
      dispatch(fetchAdminGames());
      dispatch(fetchAdminUsers());
      dispatch(fetchAdminOrders());
    };

    fetchDashboardData();

    window.addEventListener("focus", fetchDashboardData);

    const interval = setInterval(() => {
      dispatch(fetchAdminOrders());
    }, 10000);

    return () => {
      window.removeEventListener("focus", fetchDashboardData);
      clearInterval(interval);
    };
  }, [dispatch]);

  // ==============================
  // ACTIVE PRODUCTS AND GAMES
  // ==============================

  // Exclude items in Recently Deleted.

  const activeProducts = useMemo(() => {
    return products.filter(
      (item) => item.isDeleted !== true
    );
  }, [products]);

  const activeGames = useMemo(() => {
    return games.filter(
      (item) => item.isDeleted !== true
    );
  }, [games]);

  // Total = Consoles + Accessories + Games

  const totalProducts =
    activeProducts.length + activeGames.length;

  // ==============================
  // REVENUE ORDERS
  // ==============================

  const revenueOrders = useMemo(() => {
    return orders.filter(isRevenueOrder);
  }, [orders]);

  // ==============================
  // TOTAL REVENUE
  // ==============================

  const totalRevenue = revenueOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  // ==============================
  // STATISTICS
  // ==============================

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
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
      value: formatCurrency(totalRevenue),
      icon: IndianRupee,
    },
  ];

  // ==============================
  // REVENUE + ORDERS GRAPH DATA
  // ==============================

  const analyticsData = useMemo(() => {
    const today = new Date();
    const data = [];

    if (dateRange === "12") {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(
          today.getFullYear(),
          today.getMonth() - i,
          1
        );

        data.push({
          key: `${date.getFullYear()}-${date.getMonth()}`,

          name: date.toLocaleDateString("en-IN", {
            month: "short",
            year: "2-digit",
          }),

          revenue: 0,
          orders: 0,
        });
      }

      orders.forEach((order) => {
        const date = getValidDate(order.createdAt);

        if (!date) return;

        const key = `${date.getFullYear()}-${date.getMonth()}`;

        const item = data.find(
          (entry) => entry.key === key
        );

        if (item) {
          item.orders += 1;

          if (isRevenueOrder(order)) {
            item.revenue += Number(order.total || 0);
          }
        }
      });
    } else {
      const days = Number(dateRange);

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);

        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);

        const key = date.toDateString();

        data.push({
          key,

          name: date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),

          revenue: 0,
          orders: 0,
        });
      }

      orders.forEach((order) => {
        const date = getValidDate(order.createdAt);

        if (!date) return;

        const key = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        ).toDateString();

        const item = data.find(
          (entry) => entry.key === key
        );

        if (item) {
          item.orders += 1;

          if (isRevenueOrder(order)) {
            item.revenue += Number(order.total || 0);
          }
        }
      });
    }

    return data;
  }, [orders, dateRange]);

  // ==============================
  // ORDER STATUS DISTRIBUTION
  // ==============================

  const statusChartData = useMemo(() => {
    return STATUS_LIST.map((status) => ({
      name: status,

      value: orders.filter(
        (order) =>
          (order.orderStatus || "Pending").toLowerCase() ===
          status.toLowerCase()
      ).length,

      color: STATUS_COLORS[status],
    }));
  }, [orders]);

  const activeStatusData = statusChartData.filter(
    (item) => item.value > 0
  );

  // ==============================
  // RECENT ORDERS
  // ==============================

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // ==============================
  // DATE FILTERS
  // ==============================

  const rangeOptions = [
    { label: "7D", value: "7" },
    { label: "30D", value: "30" },
    { label: "12M", value: "12" },
  ];

  // ==============================
  // UI
  // ==============================

  return (
    <div className="p-4 md:p-6 xl:p-7 text-white">

      {/* HEADER */}

      <div className="mb-7">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2 text-sm">
          Welcome to your GAME DOCK administration panel.
        </p>
      </div>

      {loading && (
        <p className="text-gray-400 mb-4 text-sm">
          Loading dashboard data...
        </p>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="relative overflow-hidden bg-gradient-to-br from-[#1C1930] to-[#151322] border border-purple-500/10 p-5 rounded-2xl hover:border-purple-500/30 transition duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-2xl font-bold mt-2">
                    {item.value}
                  </h2>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
                  <Icon
                    className="text-purple-400"
                    size={22}
                  />
                </div>
              </div>

              <div className="absolute -right-8 -bottom-12 w-28 h-28 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* ANALYTICS ROW */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6 items-stretch">

        {/* SALES & ORDERS GRAPH */}

        <div className="min-w-0 bg-gradient-to-br from-[#1D1930] via-[#171426] to-[#12101F] border border-purple-500/20 rounded-2xl p-4 md:p-5 shadow-xl shadow-black/20">

          {/* GRAPH HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-purple-500/15 rounded-xl shrink-0">
                <TrendingUp
                  className="text-purple-400"
                  size={20}
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-bold">
                  Sales & Orders
                </h2>

                <p className="text-gray-500 text-xs mt-1">
                  Store performance overview
                </p>
              </div>
            </div>

            {/* DATE FILTER */}

            <div className="flex items-center gap-1 bg-[#100E1B] border border-purple-500/10 rounded-lg p-1 shrink-0">
              {rangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                    dateRange === option.value
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* GRAPH LEGEND */}

          <div className="flex flex-wrap gap-4 mb-3">

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />

              <span className="text-gray-400 text-xs">
                Revenue
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />

              <span className="text-gray-400 text-xs">
                Orders
              </span>
            </div>
          </div>

          {/* COMPACT GRAPH */}

          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData}
                margin={{
                  top: 8,
                  right: 5,
                  left: -12,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke="#39314F"
                  strokeDasharray="4 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  tick={{
                    fontSize: 10,
                    fill: "#9CA3AF",
                  }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />

                <YAxis
                  yAxisId="revenue"
                  stroke="#9CA3AF"
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `₹${value / 1000}k`
                      : `₹${value}`
                  }
                  tick={{
                    fontSize: 9,
                    fill: "#9CA3AF",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />

                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  stroke="#9CA3AF"
                  allowDecimals={false}
                  tick={{
                    fontSize: 9,
                    fill: "#9CA3AF",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={25}
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#A855F7"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#A855F7",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />

                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#22D3EE",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDER STATUS DISTRIBUTION */}

        <div className="min-w-0 bg-gradient-to-br from-[#1D1930] via-[#171426] to-[#12101F] border border-purple-500/20 rounded-2xl p-4 md:p-5 shadow-xl shadow-black/20">

          {/* STATUS HEADER */}

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/15 rounded-xl shrink-0">
              <Activity
                className="text-purple-400"
                size={20}
              />
            </div>

            <div>
              <h2 className="text-base md:text-lg font-bold">
                Order Status Distribution
              </h2>

              <p className="text-gray-500 text-xs mt-1">
                Current order breakdown
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="h-[240px] flex flex-col items-center justify-center">
              <ShoppingBag
                size={36}
                className="text-gray-600 mb-3"
              />

              <p className="text-gray-400 text-sm">
                No order data available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-[190px_minmax(0,1fr)] gap-3 items-center">

              {/* DONUT CHART */}

              <div className="relative h-[220px] min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={83}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {activeStatusData.map((item) => (
                        <Cell
                          key={item.name}
                          fill={item.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#100E1B",
                        border: "1px solid #44345E",
                        borderRadius: "10px",
                        color: "#fff",
                        padding: "8px 12px",
                        fontSize: "12px",
                      }}
                      formatter={(value, name) => [
                        `${value} Orders`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* CENTER TOTAL */}

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-gray-500 text-[9px] uppercase tracking-widest">
                    Total Orders
                  </span>

                  <span className="text-3xl font-extrabold text-white mt-1">
                    {orders.length}
                  </span>

                  <span className="text-purple-400 text-[10px] mt-0.5">
                    All Orders
                  </span>
                </div>
              </div>

              {/* STATUS BREAKDOWN */}

              <div className="space-y-3">
                {statusChartData.map((item) => {
                  const percentage =
                    orders.length > 0
                      ? (item.value / orders.length) * 100
                      : 0;

                  return (
                    <div key={item.name}>
                      <div className="flex justify-between items-center mb-1.5 gap-2">

                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              backgroundColor: item.color,
                            }}
                          />

                          <span className="text-gray-300 text-xs font-medium truncate">
                            {item.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-white text-xs font-bold">
                            {item.value}
                          </span>

                          <span className="text-gray-500 text-[10px] w-10 text-right">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <div className="h-1.5 bg-[#0E0C19] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECENT ORDERS */}

      <div className="mt-6 bg-gradient-to-br from-[#1D1930] to-[#151322] border border-purple-500/10 rounded-2xl overflow-hidden">

        <div className="p-5 border-b border-purple-500/10">
          <h2 className="text-lg font-bold">
            Recent Orders
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Latest customer orders and their current statuses.
          </p>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            No orders available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">

              <thead className="bg-[#100E1B] text-gray-400 text-xs">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => {
                  const orderStatus =
                    order.orderStatus || "Pending";

                  return (
                    <tr
                      key={order.id}
                      className="border-t border-purple-500/10 hover:bg-purple-500/[0.04] transition"
                    >
                      <td className="p-4 text-sm text-gray-300">
                        #{order.id}
                      </td>

                      <td className="p-4 text-sm text-gray-200">
                        {order.customer?.name || "Unknown"}
                      </td>

                      <td className="p-4 text-sm font-semibold text-white">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getOrderStatusStyle(
                            orderStatus
                          )}`}
                        >
                          {orderStatus}
                        </span>
                      </td>

                      <td className="p-4 text-gray-400 text-sm">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;