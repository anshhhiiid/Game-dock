
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService";


// Helper function
const getError = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;


// Fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await getUsers();
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to fetch users."));
    }
  }
);


// Add user
export const addUser = createAsyncThunk(
  "users/addUser",
  async (user, { rejectWithValue }) => {
    try {
      return await createUser(user);
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to create user."));
    }
  }
);


// Update user
export const editUser = createAsyncThunk(
  "users/editUser",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateUser(id, updates);
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to update user."));
    }
  }
);


// Delete user
export const removeUser = createAsyncThunk(
  "users/removeUser",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to delete user."));
    }
  }
);


// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
};


// User slice
const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {},

  extraReducers: (builder) => {

    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });


    // Add user
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.users.push(action.payload);
    });


    // Edit user
    builder.addCase(editUser.fulfilled, (state, action) => {
      const index = state.users.findIndex(
        (user) => String(user.id) === String(action.payload.id)
      );

      if (index !== -1) {
        state.users[index] = action.payload;
      }
    });


    // Remove user
    builder.addCase(removeUser.fulfilled, (state, action) => {
      state.users = state.users.filter(
        (user) => String(user.id) !== String(action.payload)
      );
    });
  },
});


// Export reducer
export default userSlice.reducer;
