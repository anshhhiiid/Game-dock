
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchUserCollectionItems,
  saveUserCollection,
} from "../../services/userCollectionService";


// Helper functions
const getUserId = (getState) => getState().auth.user?.id;

const getError = (error) =>
  error.response?.data?.message || error.message || "Wishlist update failed.";


// Update wishlist in database
const updateWishlist = async (getState, updater) => {
  const userId = getUserId(getState);

  if (!userId) {
    throw new Error("Please log in to use your wishlist.");
  }

  const items = await fetchUserCollectionItems("wishlists", userId);
  const updatedItems = updater(items);

  await saveUserCollection("wishlists", userId, updatedItems);

  return updatedItems;
};


// Fetch wishlist
export const fetchUserWishlist = createAsyncThunk(
  "wishlist/fetchUserWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchUserCollectionItems("wishlists", userId);
    } catch (error) {
      return rejectWithValue(getError(error));
    }
  }
);


// Add to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ product, itemType = "product" }, { getState, rejectWithValue }) => {
    try {
      return await updateWishlist(getState, (items) => {
        const exists = items.some(
          (item) =>
            String(item.id) === String(product.id) &&
            item.itemType === itemType
        );

        if (exists) return items;

        return [...items, { ...product, itemType }];
      });
    } catch (error) {
      return rejectWithValue(getError(error));
    }
  }
);


// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ id, itemType }, { getState, rejectWithValue }) => {
    try {
      return await updateWishlist(getState, (items) =>
        items.filter(
          (item) =>
            !(String(item.id) === String(id) && item.itemType === itemType)
        )
      );
    } catch (error) {
      return rejectWithValue(getError(error));
    }
  }
);


// Clear wishlist
export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await updateWishlist(getState, () => []);
    } catch (error) {
      return rejectWithValue(getError(error));
    }
  }
);


// Initial state
const initialState = {
  items: [],
  loading: false,
  saving: false,
  error: null,
};


// Wishlist slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    resetWishlistState: () => initialState,
  },

  extraReducers: (builder) => {
    const wishlistActions = [
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
    ];


    // Fetch wishlist
    builder
      .addCase(fetchUserWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchUserWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });


    // Wishlist update actions
    builder
      .addMatcher(
        (action) =>
          wishlistActions.some((thunk) => thunk.pending.match(action)),

        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addMatcher(
        (action) =>
          wishlistActions.some((thunk) => thunk.fulfilled.match(action)),

        (state, action) => {
          state.saving = false;
          state.items = action.payload;
        }
      )

      .addMatcher(
        (action) =>
          wishlistActions.some((thunk) => thunk.rejected.match(action)),

        (state, action) => {
          state.saving = false;
          state.error = action.payload || action.error.message;
        }
      );
  },
});


// Exports
export const { resetWishlistState } = wishlistSlice.actions;

export default wishlistSlice.reducer;