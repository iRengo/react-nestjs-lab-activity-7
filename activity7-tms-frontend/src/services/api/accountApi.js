const API_BASE_URL = 'http://localhost:3000';

const withAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const getAccountProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/account/me`, {
    method: 'GET',
    headers: withAuth(),
  });

  if (!response.ok) {
    throw new Error('Unable to fetch account details.');
  }

  return response.json();
};

export const updateAccountProfile = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/account/me`, {
    method: 'PATCH',
    headers: withAuth(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || 'Unable to update settings.';
    throw new Error(Array.isArray(message) ? message.join(' ') : message);
  }

  return response.json();
};
