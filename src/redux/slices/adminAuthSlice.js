import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  adminLoginAPI,
  updateAdminProfileAPI,
} from "../../services/adminService";

import { logout } from "./authSlice";

// ==============================
// LOAD SAVED ADMIN SESSION
// ==============================

let savedAdmin = null;

try {
  const storedAdmin = localStorage.getItem("gamedock_admin");

  savedAdmin = storedAdmin
    ? JSON.parse(storedAdmin)
    : null;
} catch (error) {
  localStorage.removeItem("gamedock_admin");
  savedAdmin = null;
}

// ==============================
// ADMIN LOGIN
// ==============================

export const adminLogin = createAsyncThunk(
  "adminAuth/login",

  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const admin = await adminLoginAPI(credentials);

      localStorage.setItem(
        "gamedock_admin",
        JSON.stringify(admin)
      );

      localStorage.removeItem("user");
      dispatch(logout());

      return admin;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ==============================
// UPDATE ADMIN PROFILE
// ==============================

export const updateAdminProfile = createAsyncThunk(
  "adminAuth/updateProfile",

  async (profileData, { rejectWithValue }) => {
    try {
      const updatedAdmin = await updateAdminProfileAPI(
        profileData
      );

      // Update saved admin session
      localStorage.setItem(
        "gamedock_admin",
        JSON.stringify(updatedAdmin)
      );

      return updatedAdmin;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ==============================
// ADMIN AUTH SLICE
// ==============================

const adminAuthSlice = createSlice({
  name: "adminAuth",

  initialState: {
    admin: savedAdmin,
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

      // LOGIN

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
      })

      // PROFILE UPDATE

      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })

      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;