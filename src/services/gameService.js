import api from "./api";

export const getGames = async () => (await api.get("/games")).data;

export const getGameById = async (id) =>
  (await api.get(`/games/${id}`)).data;

export const createGame = async (game) =>
  (await api.post("/games", game)).data;

export const updateGame = async (id, game) =>
  (await api.patch(`/games/${id}`, game)).data;

export const deleteGame = async (id) =>
  (await api.delete(`/games/${id}`)).data;