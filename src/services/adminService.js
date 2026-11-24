import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Admin login
export const adminLoginAPI = async (credentials) => {
  const response = await API.get(
    `/admins?email=${encodeURIComponent(credentials.email)}`
  );

  const admin = response.data.find(
    (item) => item.password === credentials.password
  );

  if (!admin) {
    throw new Error("Invalid admin email or password");
  }

  const { password, ...safeAdmin } = admin;

  return safeAdmin;
};

// Products
export const getAdminProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};

export const createProduct = async (product) => {
  const response = await API.post("/products", product);
  return response.data;
};

export const updateProduct = async ({ id, product }) => {
  const response = await API.patch(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  await API.delete(`/products/${id}`);
  return id;
};

// Users
export const getAdminUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

export const updateUserStatus = async ({ id, isBlocked }) => {
  const response = await API.patch(`/users/${id}`, {
    isBlocked,
  });

  return response.data;
};

// Orders
export const getAdminOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

export const getAdminOrderDetails = async (id) => {
  const response = await API.get(`/orders/${id}`);
  return response.data;
};

export default API;