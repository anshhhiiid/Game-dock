
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getGames,
  createGame as createGameRequest,
  updateGame as updateGameRequest,
  deleteGame as deleteGameRequest,
} from "../../services/gameService";


// Helper function
const getError = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;


// Fetch all games
export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async (_, { rejectWithValue }) => {
    try {
      return await getGames();
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to fetch games."));
    }
  }
);


// Create game
export const createGame = createAsyncThunk(
  "games/createGame",
  async (game, { rejectWithValue }) => {
    try {
      return await createGameRequest(game);
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to create game."));
    }
  }
);


// Update game
export const editGame = createAsyncThunk(
  "games/editGame",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await updateGameRequest(id, updates);
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to update game."));
    }
  }
);


// Delete game
export const removeGame = createAsyncThunk(
  "games/removeGame",
  async (id, { rejectWithValue }) => {
    try {
      await deleteGameRequest(id);
      return id;
    } catch (error) {
      return rejectWithValue(getError(error, "Failed to delete game."));
    }
  }
);


// Initial state
const initialState = {
  games: [],
  loading: false,
  error: null,
};


// Game slice
const gameSlice = createSlice({
  name: "games",
  initialState,

  reducers: {
    updateGameStock: (state, action) => {
      const game = state.games.find(
        (item) => String(item.id) === String(action.payload.id)
      );

      if (game) {
        game.stock = action.payload.stock;
      }
    },
  },


  // Handle API actions
  extraReducers: (builder) => {

    // Fetch games
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })

      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });


    // Create game
    builder.addCase(createGame.fulfilled, (state, action) => {
      state.games.push(action.payload);
    });


    // Edit game
    builder.addCase(editGame.fulfilled, (state, action) => {
      const index = state.games.findIndex(
        (game) => String(game.id) === String(action.payload.id)
      );

      if (index !== -1) {
        state.games[index] = action.payload;
      }
    });


    // Delete game
    builder.addCase(removeGame.fulfilled, (state, action) => {
      state.games = state.games.filter(
        (game) => String(game.id) !== String(action.payload)
      );
    });
  },
});


// Exports
export const { updateGameStock } = gameSlice.actions;

export default gameSlice.reducer;
