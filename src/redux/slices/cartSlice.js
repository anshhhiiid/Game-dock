import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserCollectionItems, saveUserCollection } from "../../services/userCollectionService";

const getUserId = (getState) => getState().auth.user?.id;
const updateCart = async (getState, updater) => {
  const userId = getUserId(getState);
  if (!userId) throw new Error("Please log in to use your cart.");
  const currentItems = await fetchUserCollectionItems("carts", userId);
  const nextItems = updater(currentItems);
  await saveUserCollection("carts", userId, nextItems);
  return nextItems;
};
const getError = (error) => error.response?.data?.message || error.message || "Cart update failed.";

export const fetchUserCart = createAsyncThunk("cart/fetchUserCart", async (userId, { rejectWithValue }) => {
  try { return await fetchUserCollectionItems("carts", userId); } catch (error) { return rejectWithValue(getError(error)); }
});
export const addToCart = createAsyncThunk("cart/addToCart", async ({ product, itemType = "product", quantity = 1 }, { getState, rejectWithValue }) => {
  try {
    const stock = Number(product.stock) || 0;
    if (stock <= 0) throw new Error("This item is out of stock.");
    return await updateCart(getState, (items) => {
      const index = items.findIndex((item) => String(item.id) === String(product.id) && item.itemType === itemType);
      if (index >= 0) return items;
      return [...items, { ...product, itemType, quantity: Math.min(Math.max(1, Number(quantity) || 1), stock) }];
    });
  } catch (error) { return rejectWithValue(getError(error)); }
});
export const increaseQuantity = createAsyncThunk("cart/increaseQuantity", async ({ id, itemType }, { getState, rejectWithValue }) => {
  try { return await updateCart(getState, (items) => items.map((item) => String(item.id) === String(id) && item.itemType === itemType && item.quantity < Number(item.stock) ? { ...item, quantity: item.quantity + 1 } : item)); }
  catch (error) { return rejectWithValue(getError(error)); }
});
export const decreaseQuantity = createAsyncThunk("cart/decreaseQuantity", async ({ id, itemType }, { getState, rejectWithValue }) => {
  try { return await updateCart(getState, (items) => items.map((item) => String(item.id) === String(id) && item.itemType === itemType && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)); }
  catch (error) { return rejectWithValue(getError(error)); }
});
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ id, itemType }, { getState, rejectWithValue }) => {
  try { return await updateCart(getState, (items) => items.filter((item) => !(String(item.id) === String(id) && item.itemType === itemType))); }
  catch (error) { return rejectWithValue(getError(error)); }
});
export const clearCart = createAsyncThunk("cart/clearCart", async (_, { getState, rejectWithValue }) => {
  try { return await updateCart(getState, () => []); } catch (error) { return rejectWithValue(getError(error)); }
});

const cartSlice = createSlice({
  name: "cart", initialState: { items: [], loading: false, saving: false, error: null },
  reducers: { resetCartState: (state) => { state.items = []; state.loading = false; state.saving = false; state.error = null; } },
  extraReducers: (builder) => {
    builder.addCase(fetchUserCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchUserCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addMatcher((action) => [addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart].some((thunk) => thunk.pending.match(action)), (state) => { state.saving = true; state.error = null; })
      .addMatcher((action) => [addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart].some((thunk) => thunk.fulfilled.match(action)), (state, action) => { state.saving = false; state.items = action.payload; })
      .addMatcher((action) => [addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart].some((thunk) => thunk.rejected.match(action)), (state, action) => { state.saving = false; state.error = action.payload; });
  },
});
export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
