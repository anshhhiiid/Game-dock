import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import AdminLogin from "./admin/components/pages/AdminLogin.jsx";
import Dashboard from "./admin/components/pages/Dashboard.jsx";
import AdminProducts from "./admin/components/pages/AdminProducts.jsx";
import AdminUsers from "./admin/components/pages/AdminUsers.jsx";
import AdminOrders from "./admin/components/pages/AdminOrders.jsx";

// Admin Components
import AdminLayout from "./admin/components/AdminLayout";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";


function AppContent() {

  const location = useLocation();

const isAdminRoute = location.pathname.startsWith("/admin");
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  // Fetch cart and wishlist when user changes
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

  return (
    <div className="min-h-screen flex flex-col">

{!isAdminRoute && <Navbar />}

<ScrollToTop />

<main className="flex-grow">
        <Routes>

          {/* User Routes */}
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/consoles" element={<Games />} />

          <Route path="/games" element={<Games />} />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          {/* Protected User Routes */}
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

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* Other Pages */}
          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />


          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* Protected Admin Routes */}
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

      {!isAdminRoute && <Footer />}

    </div>
  );
}


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