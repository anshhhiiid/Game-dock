import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGames } from "../../services/gameService";

export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async () => {
    return await getGames();
  }
);

const gameSlice = createSlice({
  name: "games",

  initialState: {
    games: [],
    loading: false,
    error: null,
  },

  reducers: {
    // UPDATE GAME STOCK IN REDUX
    updateGameStock: (state, action) => {
      const { id, stock } = action.payload;

      const game = state.games.find(
        (item) => String(item.id) === String(id)
      );

      if (game) {
        game.stock = stock;
      }
    },
  },

  extraReducers: (builder) => {
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
        state.error = action.error.message;
      });
  },
});

export const { updateGameStock } = gameSlice.actions;

export default gameSlice.reducer;
