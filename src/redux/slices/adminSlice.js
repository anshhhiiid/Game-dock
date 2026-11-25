import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,

  getAdminGames,
  createGame,
  updateGame,
  deleteGame,

  getAdminUsers,
  updateUserStatus,

  getAdminOrders,
  getAdminOrderDetails,
  updateAdminOrderStatus,
} from "../../services/adminService";

// ==============================
// PRODUCTS
// ==============================

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

export const removeAdminProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==============================
// GAMES
// ==============================

export const fetchAdminGames = createAsyncThunk(
  "admin/fetchGames",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminGames();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAdminGame = createAsyncThunk(
  "admin/addGame",
  async (game, { rejectWithValue }) => {
    try {
      return await createGame(game);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editAdminGame = createAsyncThunk(
  "admin/editGame",
  async ({ id, game }, { rejectWithValue }) => {
    try {
      return await updateGame({ id, game });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeAdminGame = createAsyncThunk(
  "admin/deleteGame",
  async (id, { rejectWithValue }) => {
    try {
      await deleteGame(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==============================
// USERS
// ==============================

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

// ==============================
// ORDERS
// ==============================

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

// ==============================
// UPDATE ORDER + PAYMENT STATUS
// ==============================

export const changeAdminOrderStatus = createAsyncThunk(
  "admin/changeOrderStatus",

  async ({ id, orderStatus }, { getState, rejectWithValue }) => {
    try {
      // Find the existing order
      const state = getState();
      const order = state.admin.orders.find(
        (item) => String(item.id) === String(id)
      );

      if (!order) {
        return rejectWithValue("Order not found");
      }

      // Keep existing payment status by default
      let paymentStatus = order.paymentStatus || "Pending";

      const paymentMethod = order.paymentMethod
        ?.trim()
        .toLowerCase();

      // CASH ON DELIVERY
      // Payment becomes Paid only after delivery
      if (paymentMethod === "cash on delivery") {
        paymentStatus =
          orderStatus === "Delivered" ? "Paid" : "Pending";
      }

      // UPI
      // Payment becomes Paid when processing starts
      else if (paymentMethod === "upi") {
        const paidStatuses = [
          "Processing",
          "Shipped",
          "Delivered",
        ];

        paymentStatus = paidStatuses.includes(orderStatus)
          ? "Paid"
          : "Pending";
      }

      // Update both statuses in JSON Server
      const updatedOrder = await updateAdminOrderStatus({
        id,
        orderStatus,
        paymentStatus,
      });

      return updatedOrder;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order status"
      );
    }
  }
);

// ==============================
// ADMIN SLICE
// ==============================

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    products: [],
    games: [],
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

      // ==============================
      // PRODUCTS
      // ==============================

      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
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

      // ==============================
      // GAMES
      // ==============================

      .addCase(fetchAdminGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })

      .addCase(fetchAdminGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAdminGame.fulfilled, (state, action) => {
        state.games.unshift(action.payload);
      })

      .addCase(editAdminGame.fulfilled, (state, action) => {
        const index = state.games.findIndex(
          (item) => String(item.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.games[index] = action.payload;
        }
      })

      .addCase(removeAdminGame.fulfilled, (state, action) => {
        state.games = state.games.filter(
          (item) => String(item.id) !== String(action.payload)
        );
      })

      // ==============================
      // USERS
      // ==============================

      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
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

      // ==============================
      // ORDERS
      // ==============================

      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      })

      // ==============================
      // ORDER + PAYMENT STATUS UPDATE
      // ==============================

      .addCase(changeAdminOrderStatus.pending, (state) => {
        state.error = null;
      })

      .addCase(changeAdminOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;

        // Update order in orders array
        const index = state.orders.findIndex(
          (order) =>
            String(order.id) === String(updatedOrder.id)
        );

        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...updatedOrder,
          };
        }

        // Update selected order details
        if (
          state.selectedOrder &&
          String(state.selectedOrder.id) ===
            String(updatedOrder.id)
        ) {
          state.selectedOrder = {
            ...state.selectedOrder,
            ...updatedOrder,
          };
        }
      })

      .addCase(changeAdminOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSelectedOrder } = adminSlice.actions;

export default adminSlice.reducer;