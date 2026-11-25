import { useEffect } from "react";

import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

// Main Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Games from "./pages/Games";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";

// Redux Actions
import {
  fetchUserCart,
  resetCartState,
} from "./redux/slices/cartSlice";

import {
  fetchUserWishlist,
  resetWishlistState,
} from "./redux/slices/wishlistSlice";

// Admin Pages
import Dashboard from "./admin/components/pages/Dashboard.jsx";
import AdminProducts from "./admin/components/pages/AdminProducts.jsx";
import AdminUsers from "./admin/components/pages/AdminUsers.jsx";
import AdminOrders from "./admin/components/pages/AdminOrders.jsx";

// Admin Components
import AdminLayout from "./admin/components/AdminLayout";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

// ==============================
// APP CONTENT
// ==============================

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const user = useSelector((state) => state.auth.user);

  // ==============================
  // FETCH USER CART AND WISHLIST
  // ==============================

  useEffect(() => {
    if (user?.id) {
      dispatch(resetCartState());
      dispatch(resetWishlistState());

      dispatch(fetchUserCart(user.id));
      dispatch(fetchUserWishlist(user.id));
    } else {
      dispatch(resetCartState());
      dispatch(resetWishlistState());
    }
  }, [user?.id, dispatch]);

  // ==============================
  // UI
  // ==============================

  return (
    <div className="min-h-screen flex flex-col">

      {/* USER NAVBAR */}

      {!isAdminRoute && <Navbar />}

      <ScrollToTop />

      <main className="flex-grow">

        <Routes>

          {/* ============================== */}
          {/* USER ROUTES */}
          {/* ============================== */}

          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/consoles" element={<Games />} />

          <Route path="/games" element={<Games />} />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          {/* ============================== */}
          {/* PROTECTED USER ROUTES */}
          {/* ============================== */}

          <Route element={<ProtectedRoute />}>

            <Route path="/cart" element={<Cart />} />

            <Route path="/wishlist" element={<Wishlist />} />

            <Route path="/checkout" element={<Checkout />} />

            <Route
              path="/order-success/:id"
              element={<OrderSuccess />}
            />

            <Route path="/profile" element={<Profile />} />

            <Route path="/my-orders" element={<MyOrders />} />

          </Route>

          {/* ============================== */}
          {/* COMMON AUTHENTICATION */}
          {/* ============================== */}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* Redirect old admin login URL to common login */}

          <Route
            path="/admin/login"
            element={<Navigate to="/login" replace />}
          />

          {/* ============================== */}
          {/* OTHER USER PAGES */}
          {/* ============================== */}

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          {/* ============================== */}
          {/* PROTECTED ADMIN ROUTES */}
          {/* ============================== */}

          <Route element={<AdminProtectedRoute />}>

            <Route element={<AdminLayout />}>

              <Route
                path="/admin/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/admin/products"
                element={<AdminProducts />}
              />

              <Route
                path="/admin/users"
                element={<AdminUsers />}
              />

              <Route
                path="/admin/orders"
                element={<AdminOrders />}
              />

            </Route>

          </Route>

        </Routes>

      </main>

      {/* USER FOOTER */}

      {!isAdminRoute && <Footer />}

    </div>
  );
}

// ==============================
// MAIN APP
// ==============================

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <AppContent />

    </BrowserRouter>
  );
}

export default App;