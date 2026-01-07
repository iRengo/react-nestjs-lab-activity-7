const API_BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

const withAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseError = async (response) => {
  const errorBody = await response.json().catch(() => null);
  const message = errorBody?.message || 'Request failed.';
  return Array.isArray(message) ? message.join(' ') : message;
};

export const getAllUsers = async ({role} = {}) => {
  const query = role ? `?role=${encodeURIComponent(role)}` : '';
  const response = await fetch(`${API_BASE_URL}/user_tms${query}`, {
    method: 'GET',
    headers: withAuth(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const updateUser = async (userId, payload) => {
  const response = await fetch(`${API_BASE_URL}/user_tms/${userId}`, {
    method: 'PUT',
    headers: withAuth(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user_tms/${userId}`, {
    method: 'DELETE',
    headers: withAuth(),
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(await parseError(response));
  }
};

export default {
  getAllUsers,
  updateUser,
  deleteUser,
};
