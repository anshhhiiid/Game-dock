import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../services/api";

import {
  createOrderService,
  getUserOrdersService,
  getSingleOrderService,
} from "../../services/orderService";

import { updateProductStock } from "./productSlice";
import { updateGameStock } from "./gameSlice";

// PLACE ORDER AND REDUCE STOCK
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",

  async (orderData, { rejectWithValue, dispatch }) => {
    const updatedStocks = [];

    try {
      if (!orderData.items || orderData.items.length === 0) {
        return rejectWithValue("Your cart is empty.");
      }

      // Combine duplicate items, if any
      const groupedItems = Object.values(
        orderData.items.reduce((acc, item) => {
          const itemType = item.itemType || "product";
          const key = `${itemType}-${item.id}`;

          if (!acc[key]) {
            acc[key] = { ...item, itemType, quantity: 0 };
          }

          acc[key].quantity += Number(item.quantity) || 0;

          return acc;
        }, {})
      );

      // CHECK LATEST STOCK FROM JSON SERVER
      const stockChecks = [];

      for (const item of groupedItems) {
        const collection =
          item.itemType === "game" ? "/games" : "/products";

        const response = await api.get(
          `${collection}/${item.id}`
        );

        const currentStock = Number(response.data.stock);
        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error(`Invalid quantity for ${item.name}.`);
        }

        if (currentStock < quantity) {
          throw new Error(
            `${item.name}: Only ${currentStock} left in stock.`
          );
        }

        stockChecks.push({
          id: item.id,
          itemType: item.itemType,
          collection,
          oldStock: currentStock,
          newStock: currentStock - quantity,
        });
      }

      // UPDATE STOCK IN JSON SERVER
      for (const item of stockChecks) {
        await api.patch(
          `${item.collection}/${item.id}`,
          { stock: item.newStock }
        );

        updatedStocks.push(item);
      }

      // SAVE ORDER
      const result = await createOrderService(orderData);

      // UPDATE REDUX STOCK
      updatedStocks.forEach((item) => {
        if (item.itemType === "game") {
          dispatch(
            updateGameStock({
              id: item.id,
              stock: item.newStock,
            })
          );
        } else {
          dispatch(
            updateProductStock({
              id: item.id,
              stock: item.newStock,
            })
          );
        }
      });

      return result;

    } catch (error) {
      // RESTORE STOCK IF ORDER CREATION FAILED
      for (const item of updatedStocks.reverse()) {
        try {
          await api.patch(
            `${item.collection}/${item.id}`,
            { stock: item.oldStock }
          );
        } catch (rollbackError) {
          console.error(
            "Could not restore stock:",
            rollbackError
          );
        }
      }

      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to place order."
      );
    }
  }
);

// FETCH USER ORDERS
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",

  async (userId, { rejectWithValue }) => {
    try {
      return await getUserOrdersService(userId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch orders."
      );
    }
  }
);

// FETCH SINGLE ORDER
export const fetchSingleOrder = createAsyncThunk(
  "orders/fetchSingleOrder",

  async (orderId, { rejectWithValue }) => {
    try {
      return await getSingleOrderService(orderId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch order."
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearOrderMessages: (state) => {
      state.error = null;
      state.success = false;
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // PLACE ORDER
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH USER ORDERS
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SINGLE ORDER
      .addCase(fetchSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })

      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearOrderMessages,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
