import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGames, createGame as createGameRequest, updateGame as updateGameRequest, deleteGame as deleteGameRequest } from "../../services/gameService";
const errorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;
export const fetchGames = createAsyncThunk("games/fetchGames", async (_, { rejectWithValue }) => { try { return await getGames(); } catch (error) { return rejectWithValue(errorMessage(error, "Failed to fetch games.")); } });
export const createGame = createAsyncThunk("games/createGame", async (game, { rejectWithValue }) => { try { return await createGameRequest(game); } catch (error) { return rejectWithValue(errorMessage(error, "Failed to create game.")); } });
export const editGame = createAsyncThunk("games/editGame", async ({ id, updates }, { rejectWithValue }) => { try { return await updateGameRequest(id, updates); } catch (error) { return rejectWithValue(errorMessage(error, "Failed to update game.")); } });
export const removeGame = createAsyncThunk("games/removeGame", async (id, { rejectWithValue }) => { try { await deleteGameRequest(id); return id; } catch (error) { return rejectWithValue(errorMessage(error, "Failed to delete game.")); } });
const gameSlice = createSlice({
  name: "games", initialState: { games: [], loading: false, error: null },
  reducers: { updateGameStock: (state, action) => { const game = state.games.find((item) => String(item.id) === String(action.payload.id)); if (game) game.stock = action.payload.stock; } },
  extraReducers: (builder) => {
    builder.addCase(fetchGames.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGames.fulfilled, (state, action) => { state.loading = false; state.games = action.payload; })
      .addCase(fetchGames.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message; })
      .addCase(createGame.fulfilled, (state, action) => { state.games.push(action.payload); })
      .addCase(editGame.fulfilled, (state, action) => { const i = state.games.findIndex((g) => String(g.id) === String(action.payload.id)); if (i !== -1) state.games[i] = action.payload; })
      .addCase(removeGame.fulfilled, (state, action) => { state.games = state.games.filter((g) => String(g.id) !== String(action.payload)); });
  },
});
export const { updateGameStock } = gameSlice.actions;
export default gameSlice.reducer;
