import api from "./api";

// Each user has one JSON Server record containing their item array.
export const getUserCollection = async (resource, userId) => {
  const response = await api.get(`/${resource}`, {
    params: { userId },
  });

  return response.data[0] || null;
};

export const saveUserCollection = async (resource, userId, items) => {
  const existing = await getUserCollection(resource, userId);

  if (existing && items.length === 0) {
    await api.delete(`/${resource}/${existing.id}`);
    return { userId, items: [] };
  }

  if (existing) {
    const response = await api.patch(`/${resource}/${existing.id}`, { items });
    return response.data;
  }

  if (items.length === 0) return { userId, items: [] };

  const response = await api.post(`/${resource}`, { userId, items });
  return response.data;
};

export const fetchUserCollectionItems = async (resource, userId) => {
  const record = await getUserCollection(resource, userId);
  return record?.items || [];
};
