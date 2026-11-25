import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  findUserByEmail,
  createUser,
} from "../../services/userService";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const existingUser = await findUserByEmail(userData.email);

      if (existingUser) {
        return rejectWithValue(
          "Email is already registered."
        );
      }

      const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        isBlocked: false,
      };

      const result = await createUser(newUser);

      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed."
      );
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const foundUser = await findUserByEmail(userData.email);

      // CHECK EMAIL AND PASSWORD
      const user =
        foundUser &&
        foundUser.password === userData.password
          ? foundUser
          : null;

      if (!user) {
        return rejectWithValue(
          "Invalid email or password."
        );
      }

      // CHECK BLOCKED STATUS
      if (user.isBlocked === true) {
        return rejectWithValue(
          "Account Blocked: This account has been blocked by the administrator. Please contact GAME DOCK support for assistance."
        );
      }

      // SAFE USER PROFILE
      const safeUser = { ...user };

      delete safeUser.password;

      localStorage.setItem(
        "user",
        JSON.stringify(safeUser)
      );

      return safeUser;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed."
      );
    }
  }
);

// GET STORED USER
const getStoredUser = () => {
  try {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) || null;

    if (storedUser?.password) {
      const safeUser = { ...storedUser };

      delete safeUser.password;

      localStorage.setItem(
        "user",
        JSON.stringify(safeUser)
      );

      return safeUser;
    }

    return storedUser;

  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

// AUTH SLICE
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: getStoredUser(),
    loading: false,
    error: null,
    success: false,
  },

  reducers: {

    // LOGOUT
    logout: (state) => {
      state.user = null;
      state.success = false;
      state.error = null;

      localStorage.removeItem("user");
    },

    // CLEAR AUTH MESSAGES
    clearAuthMessages: (state) => {
      state.error = null;
      state.success = false;
    },

  },

  extraReducers: (builder) => {

    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const {
  logout,
  clearAuthMessages,
} = authSlice.actions;

export default authSlice.reducer;