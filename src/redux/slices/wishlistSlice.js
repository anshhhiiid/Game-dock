import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserCollectionItems, saveUserCollection } from "../../services/userCollectionService";
const getUserId = (getState) => getState().auth.user?.id;
const updateWishlist = async (getState, updater) => {
  const userId = getUserId(getState);
  if (!userId) throw new Error("Please log in to use your wishlist.");
  const currentItems = await fetchUserCollectionItems("wishlists", userId);
  const nextItems = updater(currentItems);
  await saveUserCollection("wishlists", userId, nextItems);
  return nextItems;
};
const getError = (error) => error.response?.data?.message || error.message || "Wishlist update failed.";
export const fetchUserWishlist = createAsyncThunk("wishlist/fetchUserWishlist", async (userId, { rejectWithValue }) => { try { return await fetchUserCollectionItems("wishlists", userId); } catch (error) { return rejectWithValue(getError(error)); } });
export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async ({ product, itemType = "product" }, { getState, rejectWithValue }) => {
  try { return await updateWishlist(getState, (items) => items.some((item) => String(item.id) === String(product.id) && item.itemType === itemType) ? items : [...items, { ...product, itemType }]); }
  catch (error) { return rejectWithValue(getError(error)); }
});
export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async ({ id, itemType }, { getState, rejectWithValue }) => {
  try { return await updateWishlist(getState, (items) => items.filter((item) => !(String(item.id) === String(id) && item.itemType === itemType))); }
  catch (error) { return rejectWithValue(getError(error)); }
});
export const clearWishlist = createAsyncThunk("wishlist/clearWishlist", async (_, { getState, rejectWithValue }) => {
  try { return await updateWishlist(getState, () => []); } catch (error) { return rejectWithValue(getError(error)); }
});
const wishlistSlice = createSlice({
  name: "wishlist", initialState: { items: [], loading: false, saving: false, error: null },
  reducers: { resetWishlistState: (state) => { state.items = []; state.loading = false; state.saving = false; state.error = null; } },
  extraReducers: (builder) => {
    builder.addCase(fetchUserWishlist.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserWishlist.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchUserWishlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addMatcher((action) => [addToWishlist, removeFromWishlist, clearWishlist].some((thunk) => thunk.pending.match(action)), (state) => { state.saving = true; state.error = null; })
      .addMatcher((action) => [addToWishlist, removeFromWishlist, clearWishlist].some((thunk) => thunk.fulfilled.match(action)), (state, action) => { state.saving = false; state.items = action.payload; })
      .addMatcher((action) => [addToWishlist, removeFromWishlist, clearWishlist].some((thunk) => thunk.rejected.match(action)), (state, action) => { state.saving = false; state.error = action.payload; });
  },
});
export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
