import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminUsers,
  updateUserStatus,
  getAdminOrders,
  getAdminOrderDetails,
} from "../../services/adminService";

// FETCH PRODUCTS
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminProducts();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ADD PRODUCT
export const addAdminProduct = createAsyncThunk(
  "admin/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      return await createProduct(product);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE PRODUCT
export const editAdminProduct = createAsyncThunk(
  "admin/editProduct",
  async ({ id, product }, { rejectWithValue }) => {
    try {
      return await updateProduct({ id, product });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// DELETE PRODUCT
export const removeAdminProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteProduct(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// FETCH USERS
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminUsers();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// BLOCK / UNBLOCK USER
export const changeUserStatus = createAsyncThunk(
  "admin/changeUserStatus",
  async ({ id, isBlocked }, { rejectWithValue }) => {
    try {
      return await updateUserStatus({ id, isBlocked });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// FETCH ORDERS
export const fetchAdminOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminOrders();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// FETCH SINGLE ORDER
export const fetchAdminOrderDetails = createAsyncThunk(
  "admin/fetchOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      return await getAdminOrderDetails(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    products: [],
    users: [],
    orders: [],
    selectedOrder: null,

    loading: false,
    error: null,
  },

  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // PRODUCTS
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAdminProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })

      .addCase(editAdminProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (item) => String(item.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      .addCase(removeAdminProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (item) => String(item.id) !== String(action.payload)
        );
      })

      // USERS
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changeUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => String(user.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // ORDERS
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminOrderDetails.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      });
  },
});

export const { clearSelectedOrder } = adminSlice.actions;

export default adminSlice.reducer;