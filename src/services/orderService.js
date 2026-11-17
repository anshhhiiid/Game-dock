import api from "./api";

// CREATE NEW ORDER
export const createOrderService = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// GET ORDERS OF A USER
export const getUserOrdersService = async (userId) => {
  const response = await api.get("/orders", {
    params: {
      userId,
    },
  });

  return response.data;
};

// GET SINGLE ORDER
export const getSingleOrderService = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
