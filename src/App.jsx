import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

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
import { fetchUserCart, resetCartState } from "./redux/slices/cartSlice";
import { fetchUserWishlist, resetWishlistState } from "./redux/slices/wishlistSlice";

function AppContent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Load each signed-in user's cart and wishlist from JSON Server.
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
  }, [dispatch, user?.id]);

  return (
    <div className="w-full min-h-screen bg-[#100E1B] text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/consoles" element={<Products />} />
        <Route path="/games" element={<Games />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 2500, style: { background: "#1A1827", color: "#fff", border: "1px solid #7C3AED", borderRadius: "12px" } }} />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
