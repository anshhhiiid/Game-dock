import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct as createProductRequest,
  updateProduct as updateProductRequest,
  deleteProduct as deleteProductRequest,
} from "../../services/productService";

const errorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try { return await getProducts(); } catch (error) { return rejectWithValue(errorMessage(error, "Failed to fetch products.")); }
});
export const createProduct = createAsyncThunk("products/createProduct", async (product, { rejectWithValue }) => {
  try { return await createProductRequest(product); } catch (error) { return rejectWithValue(errorMessage(error, "Failed to create product.")); }
});
export const editProduct = createAsyncThunk("products/editProduct", async ({ id, updates }, { rejectWithValue }) => {
  try { return await updateProductRequest(id, updates); } catch (error) { return rejectWithValue(errorMessage(error, "Failed to update product.")); }
});
export const removeProduct = createAsyncThunk("products/removeProduct", async (id, { rejectWithValue }) => {
  try { await deleteProductRequest(id); return id; } catch (error) { return rejectWithValue(errorMessage(error, "Failed to delete product.")); }
});

const productSlice = createSlice({
  name: "products",
  initialState: { products: [], loading: false, error: null },
  reducers: {
    updateProductStock: (state, action) => {
      const product = state.products.find((item) => String(item.id) === String(action.payload.id));
      if (product) product.stock = action.payload.stock;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message; })
      .addCase(createProduct.fulfilled, (state, action) => { state.products.push(action.payload); })
      .addCase(editProduct.fulfilled, (state, action) => { const i = state.products.findIndex((p) => String(p.id) === String(action.payload.id)); if (i !== -1) state.products[i] = action.payload; })
      .addCase(removeProduct.fulfilled, (state, action) => { state.products = state.products.filter((p) => String(p.id) !== String(action.payload)); });
  },
});
export const { updateProductStock } = productSlice.actions;
export default productSlice.reducer;
