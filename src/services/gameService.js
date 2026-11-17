import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000"
});

export const getGames = async () => {
  const response = await API.get("/games");
  return response.data;
};
