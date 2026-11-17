import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // ADD TO CART
    addToCart: (state, action) => {
      const { product, itemType } = action.payload;

      const existingItem = state.items.find(
        (item) =>
          String(item.id) === String(product.id) &&
          item.itemType === itemType
      );

      // Don't increase quantity if item already exists
      if (existingItem) {
        return;
      }

      const stock = Number(product.stock) || 0;

      if (stock > 0) {
        state.items.push({
          ...product,
          itemType,
          quantity: 1,
        });
      }
    },

    // INCREASE QUANTITY
    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          String(item.id) === String(action.payload.id) &&
          item.itemType === action.payload.itemType
      );

      if (item && item.quantity < Number(item.stock)) {
        item.quantity += 1;
      }
    },

    // DECREASE QUANTITY
    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          String(item.id) === String(action.payload.id) &&
          item.itemType === action.payload.itemType
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // REMOVE FROM CART
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            String(item.id) === String(action.payload.id) &&
            item.itemType === action.payload.itemType
          )
      );
    },

    // CLEAR CART
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
