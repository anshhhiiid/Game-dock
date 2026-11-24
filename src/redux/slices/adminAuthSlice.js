import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminLoginAPI } from "../../services/adminService";

const savedAdmin = localStorage.getItem("gamedock_admin");

export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const admin = await adminLoginAPI(credentials);

      localStorage.setItem("gamedock_admin", JSON.stringify(admin));

      return admin;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const adminAuthSlice = createSlice({
  name: "adminAuth",

  initialState: {
    admin: savedAdmin ? JSON.parse(savedAdmin) : null,
    loading: false,
    error: null,
  },

  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      localStorage.removeItem("gamedock_admin");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;