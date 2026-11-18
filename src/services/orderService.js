import api from "./api";

export const createOrderService = async (orderData) =>
  (await api.post("/orders", orderData)).data;

export const getUserOrdersService = async (userId) =>
  (await api.get("/orders", { params: { userId } })).data;

export const getSingleOrderService = async (orderId) =>
  (await api.get(`/orders/${orderId}`)).data;

export const getAllOrdersService = async () =>
  (await api.get("/orders")).data;

export const updateOrderService = async (orderId, updates) =>
  (await api.patch(`/orders/${orderId}`, updates)).data;

export const deleteOrderService = async (orderId) =>
  (await api.delete(`/orders/${orderId}`)).data;