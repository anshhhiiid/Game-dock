import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================
// ADMIN LOGIN
// =====================================

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

  // Never return password
  const { password, ...safeAdmin } = admin;

  return safeAdmin;
};

// =====================================
// ADMIN PROFILE UPDATE
// =====================================

export const updateAdminProfileAPI = async ({
  id,
  name,
  email,
  phone,
  profileImage,
  currentPassword,
  newPassword,
}) => {
  // Get existing admin record
  const response = await API.get(`/admins/${id}`);

  const existingAdmin = response.data;

  if (!existingAdmin) {
    throw new Error("Admin account not found.");
  }

  // Check duplicate email
  const emailResponse = await API.get(
    `/admins?email=${encodeURIComponent(email)}`
  );

  const emailExists = emailResponse.data.some(
    (item) => String(item.id) !== String(id)
  );

  if (emailExists) {
    throw new Error("This email is already being used.");
  }

  // Verify current password when changing password
  if (newPassword) {
    if (existingAdmin.password !== currentPassword) {
      throw new Error("Current password is incorrect.");
    }
  }

  const updatedData = {
    name,
    email,
    phone,
    profileImage,
  };

  // Only update password when requested
  if (newPassword) {
    updatedData.password = newPassword;
  }

  const updateResponse = await API.patch(
    `/admins/${id}`,
    updatedData
  );

  // Never return password to Redux or localStorage
  const { password, ...safeAdmin } = updateResponse.data;

  return safeAdmin;
};

// =====================================
// PRODUCTS
// =====================================

export const getAdminProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};

export const createProduct = async (product) => {
  const response = await API.post("/products", {
    ...product,
    isDeleted: false,
  });

  return response.data;
};

export const updateProduct = async ({ id, product }) => {
  const response = await API.patch(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.patch(`/products/${id}`, {
    isDeleted: true,
  });

  return response.data;
};

export const restoreProduct = async (id) => {
  const response = await API.patch(`/products/${id}`, {
    isDeleted: false,
  });

  return response.data;
};

export const permanentlyDeleteProduct = async (id) => {
  await API.delete(`/products/${id}`);
  return id;
};

// =====================================
// GAMES
// =====================================

export const getAdminGames = async () => {
  const response = await API.get("/games");
  return response.data;
};

export const createGame = async (game) => {
  const response = await API.post("/games", {
    ...game,
    isDeleted: false,
  });

  return response.data;
};

export const updateGame = async ({ id, game }) => {
  const response = await API.patch(`/games/${id}`, game);
  return response.data;
};

export const deleteGame = async (id) => {
  const response = await API.patch(`/games/${id}`, {
    isDeleted: true,
  });

  return response.data;
};

export const restoreGame = async (id) => {
  const response = await API.patch(`/games/${id}`, {
    isDeleted: false,
  });

  return response.data;
};

export const permanentlyDeleteGame = async (id) => {
  await API.delete(`/games/${id}`);
  return id;
};

// =====================================
// USERS
// =====================================

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

// =====================================
// ORDERS
// =====================================

export const getAdminOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

export const getAdminOrderDetails = async (id) => {
  const response = await API.get(`/orders/${id}`);
  return response.data;
};

export const updateAdminOrderStatus = async ({
  id,
  orderStatus,
  paymentStatus,
}) => {
  const response = await API.patch(`/orders/${id}`, {
    orderStatus,
    paymentStatus,
  });

  return response.data;
};

// =====================================
// DEFAULT EXPORT
// =====================================

export default API;