import api from "./api";

// GET - Fetch all users
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// GET - Fetch a single user
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// POST - Create a new user
export const createUser = async (user) => {
  const response = await api.post("/users", user);
  return response.data;
};

// PATCH - Update user details
export const updateUser = async (id, user) => {
  const response = await api.patch(`/users/${id}`, user);
  return response.data;
};

// DELETE - Delete a user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// GET - Find a user using email
export const findUserByEmail = async (email) => {
  const response = await api.get("/users", {
    params: { email },
  });

  return response.data[0] || null;
};