import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",

 initialState: {
  items: JSON.parse(localStorage.getItem("wishlist")) || [],
},

  reducers: {
    addToWishlist: (state, action) => {
      const { product, itemType = "product" } = action.payload;

      const exists = state.items.some(
        (item) =>
          item.id === product.id && item.itemType === itemType
      );

      if (!exists) {
        state.items.push({
          ...product,
          itemType,
        });
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id &&
            item.itemType === action.payload.itemType)
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
