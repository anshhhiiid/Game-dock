import api from "./api";

// GET - Fetch all products
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// GET - Fetch a single product
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// POST - Create a new product
export const createProduct = async (product) => {
  const response = await api.post("/products", product);
  return response.data;
};

// PATCH - Update an existing product
export const updateProduct = async (id, product) => {
  const response = await api.patch(`/products/${id}`, product);
  return response.data;
};

// DELETE - Delete a product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};