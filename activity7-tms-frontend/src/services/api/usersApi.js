const API_BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

const withAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: withAuth(),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || 'Unable to fetch users.';
    throw new Error(Array.isArray(message) ? message.join(' ') : message);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export default {
  getAllUsers,
};
