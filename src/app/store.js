import { configureStore } from "@reduxjs/toolkit";

// Existing Redux slices
import productReducer from "../redux/slices/productSlice";
import gameReducer from "../redux/slices/gameSlice";
import cartReducer from "../redux/slices/cartSlice";
import wishlistReducer from "../redux/slices/wishlistSlice";
import authReducer from "../redux/slices/authSlice";
import orderReducer from "../redux/slices/orderSlice";
import userReducer from "../redux/slices/userSlice";

// Admin Redux slices
import adminAuthReducer from "../redux/slices/adminAuthSlice";
import adminReducer from "../redux/slices/adminSlice";

export const store = configureStore({
  reducer: {
    // Customer side
    products: productReducer,
    games: gameReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    orders: orderReducer,
    users: userReducer,

    // Admin side
    adminAuth: adminAuthReducer,
    admin: adminReducer,
  },
});