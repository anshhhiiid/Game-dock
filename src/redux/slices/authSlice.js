import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { findUserByEmail, createUser } from "../../services/userService";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Check whether email already exists
      const existingUser = await findUserByEmail(userData.email);

      if (existingUser) {
        return rejectWithValue("Email is already registered.");
      }

      // Create new user
      const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };

      const result = await createUser(newUser);

      return result;
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
      const foundUser = await findUserByEmail(userData.email);
      const user = foundUser && foundUser.password === userData.password ? foundUser : null;

if (!user) {
  return rejectWithValue("Invalid email or password.");
}

// Keep the session profile only; never persist the password in localStorage.
const safeUser = { ...user };
delete safeUser.password;
localStorage.setItem("user", JSON.stringify(safeUser));

return safeUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed."
      );
    }
  }
);

const getStoredUser = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    if (storedUser?.password) {
      const safeUser = { ...storedUser };
      delete safeUser.password;
      localStorage.setItem("user", JSON.stringify(safeUser));
      return safeUser;
    }
    return storedUser;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",

 initialState: {
  user: getStoredUser(),
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
