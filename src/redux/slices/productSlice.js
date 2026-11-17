import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../../services/productService";

// FETCH PRODUCTS
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    return await getProducts();
  }
);

const productSlice = createSlice({
  name: "products",

  initialState: {
    products: [],
    loading: false,
    error: null,
  },

  reducers: {
    // UPDATE STOCK IN REDUX AFTER SUCCESSFUL ORDER
    updateProductStock: (state, action) => {
      const { id, stock } = action.payload;

      const product = state.products.find(
        (item) => String(item.id) === String(id)
      );

      if (product) {
        product.stock = stock;
      }
    },
  },

  extraReducers: (builder) => {
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
        state.error = action.error.message;
      });
  },
});

export const { updateProductStock } = productSlice.actions;

export default productSlice.reducer;
