import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userService";
const getError = (error, fallback) => error.response?.data?.message || error.message || fallback;
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => { try { return await getUsers(); } catch (error) { return rejectWithValue(getError(error, "Failed to fetch users.")); } });
export const addUser = createAsyncThunk("users/addUser", async (user, { rejectWithValue }) => { try { return await createUser(user); } catch (error) { return rejectWithValue(getError(error, "Failed to create user.")); } });
export const editUser = createAsyncThunk("users/editUser", async ({ id, updates }, { rejectWithValue }) => { try { return await updateUser(id, updates); } catch (error) { return rejectWithValue(getError(error, "Failed to update user.")); } });
export const removeUser = createAsyncThunk("users/removeUser", async (id, { rejectWithValue }) => { try { await deleteUser(id); return id; } catch (error) { return rejectWithValue(getError(error, "Failed to delete user.")); } });
const userSlice = createSlice({
  name: "users", initialState: { users: [], loading: false, error: null }, reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addUser.fulfilled, (state, action) => { state.users.push(action.payload); })
      .addCase(editUser.fulfilled, (state, action) => { const i = state.users.findIndex((user) => String(user.id) === String(action.payload.id)); if (i !== -1) state.users[i] = action.payload; })
      .addCase(removeUser.fulfilled, (state, action) => { state.users = state.users.filter((user) => String(user.id) !== String(action.payload)); });
  },
});
export default userSlice.reducer;
