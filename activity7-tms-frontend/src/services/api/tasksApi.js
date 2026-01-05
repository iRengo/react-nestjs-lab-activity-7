const API_BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

const withAuth = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const headers = {'Content-Type': 'application/json'};

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

export const getTasks = async (projectId) => {
  const query = projectId ? `?projectId=${projectId}` : '';
  const response = await fetch(`${API_BASE_URL}/tasks${query}`, {
    method: 'GET',
    headers: withAuth(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createTask = async (taskPayload) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: withAuth(),
    body: JSON.stringify(taskPayload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const updateTask = async (taskId, taskPayload) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: withAuth(),
    body: JSON.stringify(taskPayload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: withAuth(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json().catch(() => ({deleted: true}));
};
