import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../redux/slices/productSlice";
import gameReducer from "../redux/slices/gameSlice";
import cartReducer from "../redux/slices/cartSlice";
import wishlistReducer from "../redux/slices/wishlistSlice";
import authReducer from "../redux/slices/authSlice";
import orderReducer from "../redux/slices/orderSlice";
import userReducer from "../redux/slices/userSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    games: gameReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    orders: orderReducer,
    users: userReducer,
  },
});
