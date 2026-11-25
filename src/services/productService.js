import api from "./api";

// GET - Fetch active products only
export const getProducts = async () => {
  const response = await api.get("/products");

  return response.data.filter(
    (product) => product.isDeleted !== true
  );
};

// GET - Fetch a single active product
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  if (response.data.isDeleted === true) {
    throw new Error("This product is no longer available.");
  }

  return response.data;
};

// POST - Create a new product
export const createProduct = async (product) => {
  const response = await api.post("/products", {
    ...product,
    isDeleted: false,
  });

  return response.data;
};

// PATCH - Update an existing product
export const updateProduct = async (id, product) => {
  const response = await api.patch(`/products/${id}`, product);
  return response.data;
};

// DELETE - Permanently delete a product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};