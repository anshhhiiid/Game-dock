import { useEffect } from "react";

import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";

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

// USER SERVICES
import { findUserByEmail } from "./services/userService";

// AUTH ACTIONS
import { logout } from "./redux/slices/authSlice";

// CART ACTIONS
import {
  fetchUserCart,
  resetCartState,
} from "./redux/slices/cartSlice";

// WISHLIST ACTIONS
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const admin = useSelector(
    (state) => state.adminAuth.admin
  );

  const isAdminRoute = location.pathname.startsWith("/admin");

  // ==============================
  // FETCH USER CART AND WISHLIST
  // ==============================

  useEffect(() => {
    // Admin should not access customer cart/wishlist.
    if (admin) {
      dispatch(resetCartState());
      dispatch(resetWishlistState());
      return;
    }

    if (user?.id) {
      dispatch(resetCartState());
      dispatch(resetWishlistState());

      dispatch(fetchUserCart(user.id));
      dispatch(fetchUserWishlist(user.id));
    } else {
      dispatch(resetCartState());
      dispatch(resetWishlistState());
    }
  }, [user?.id, admin, dispatch]);

  // ==============================
  // CHECK IF CUSTOMER IS BLOCKED
  // ==============================

  useEffect(() => {
    if (admin || !user?.id || !user?.email) {
      return;
    }

    let isChecking = false;
    let active = true;

    const checkAccountStatus = async () => {
      if (isChecking) return;

      isChecking = true;

      try {
        const latestUser = await findUserByEmail(user.email);

        if (!active) return;

        if (!latestUser || latestUser.isBlocked === true) {
          // CLEAR CUSTOMER SESSION
          localStorage.removeItem("user");

          dispatch(logout());

          // CLEAR CUSTOMER CART AND WISHLIST
          dispatch(resetCartState());
          dispatch(resetWishlistState());

          toast.error(
            "Your account has been blocked by the administrator. Please contact GAME DOCK support.",
            {
              duration: 6000,
            }
          );

          navigate("/login", {
            replace: true,
            state: {
              accountBlocked: true,
            },
          });
        }
      } catch (error) {
        console.error(
          "Account status check failed:",
          error
        );
      } finally {
        isChecking = false;
      }
    };

    const interval = setInterval(
      checkAccountStatus,
      3000
    );

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user?.id, user?.email, admin, dispatch, navigate]);

  // ==============================
  // EXCLUSIVE ADMIN ACCESS
  // ==============================

  // IMPORTANT:
  // This check comes AFTER all hooks.
  // Therefore, React always executes hooks
  // in the same order.

  if (admin && !isAdminRoute) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

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

          {/* USER ROUTES */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/consoles"
            element={<Games />}
          />

          <Route
            path="/games"
            element={<Games />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          {/* PROTECTED USER ROUTES */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/order-success/:id"
              element={<OrderSuccess />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/my-orders"
              element={<MyOrders />}
            />

          </Route>

          {/* AUTHENTICATION */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/admin/login"
            element={<Navigate to="/login" replace />}
          />

          {/* OTHER PAGES */}

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* ADMIN ROUTES */}

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
        toastOptions={{
          duration: 3000,

          style: {
            background: "#000000",
            color: "#ffffff",
            border: "1px solid #333333",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
          },

          success: {
            style: {
              background: "#000000",
              color: "#ffffff",
              border: "1px solid #333333",
            },

            iconTheme: {
              primary: "#22c55e",
              secondary: "#000000",
            },
          },

          error: {
            style: {
              background: "#000000",
              color: "#ffffff",
              border: "1px solid #333333",
            },

            iconTheme: {
              primary: "#ef4444",
              secondary: "#000000",
            },
          },
        }}
      />

      <AppContent />

    </BrowserRouter>
  );
}

export default App;