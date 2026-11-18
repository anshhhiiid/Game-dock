
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getProducts,
  createProduct as createProductRequest,
  updateProduct as updateProductRequest,
  deleteProduct as deleteProductRequest,
} from "../../services/productService";


// Helper function
const getError = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;


// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getProducts();
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to fetch products."));
    }
  }
);


// Create product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product, { rejectWithValue }) => {
    try {
      return await createProductRequest(product);
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to create product."));
    }
  }
);


// Update product
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateProductRequest(id, updates);
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to update product."));
    }
  }
);


// Delete product
export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductRequest(id);
      return id;
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to delete product."));
    }
  }
);


// Initial state
const initialState = {
  products: [],
  loading: false,
  error: null,
};


// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    updateProductStock: (state, action) => {
      const product = state.products.find(
        (item) => String(item.id) === String(action.payload.id)
      );

      if (product) {
        product.stock = action.payload.stock;
      }
    },
  },


  // Handle API actions
  extraReducers: (builder) => {

    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });


    // Create product
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
    });


    // Edit product
    builder.addCase(editProduct.fulfilled, (state, action) => {
      const index = state.products.findIndex(
        (product) => String(product.id) === String(action.payload.id)
      );

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    });


    // Delete product
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (product) => String(product.id) !== String(action.payload)
      );
    });
  },
});


// Exports
export const { updateProductStock } = productSlice.actions;

export default productSlice.reducer;
