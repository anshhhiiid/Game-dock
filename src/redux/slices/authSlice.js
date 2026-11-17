import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Check whether email already exists
      const response = await api.get("/users", {
        params: {
          email: userData.email,
        },
      });

      if (response.data.length > 0) {
        return rejectWithValue("Email is already registered.");
      }

      // Create new user
      const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };

      const result = await api.post("/users", newUser);

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed."
      );
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.get("/users", {
        params: {
          email: userData.email,
        },
      });

   const user = response.data.find(
  (user) => user.password === userData.password
);

if (!user) {
  return rejectWithValue("Invalid email or password.");
}

// Save user information
localStorage.setItem("user", JSON.stringify(user));

return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

 initialState: {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
  success: false,
},

  reducers: {
    logout: (state) => {
      state.user = null;
      state.success = false;
      state.error = null;
    },

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

export const { logout, clearAuthMessages } = authSlice.actions;

export default authSlice.reducer;
