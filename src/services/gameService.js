import api from "./api";

// GET - Fetch active games only
export const getGames = async () => {
  const response = await api.get("/games");

  return response.data.filter(
    (game) => game.isDeleted !== true
  );
};

// GET - Fetch a single active game
export const getGameById = async (id) => {
  const response = await api.get(`/games/${id}`);

  if (response.data.isDeleted === true) {
    throw new Error("This game is no longer available.");
  }

  return response.data;
};

// POST - Create a new game
export const createGame = async (game) => {
  const response = await api.post("/games", {
    ...game,
    isDeleted: false,
  });

  return response.data;
};

// PATCH - Update an existing game
export const updateGame = async (id, game) => {
  const response = await api.patch(`/games/${id}`, game);
  return response.data;
};

// DELETE - Permanently delete a game
export const deleteGame = async (id) => {
  const response = await api.delete(`/games/${id}`);
  return response.data;
};