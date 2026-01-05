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

export const getAllProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'GET',
    headers: withAuth(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createProject = async (projectPayload) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: withAuth(),
    body: JSON.stringify(projectPayload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const updateProject = async (projectId, projectPayload) => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'PATCH',
    headers: withAuth(),
    body: JSON.stringify(projectPayload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const deleteProject = async (projectId) => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: withAuth(),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json().catch(() => ({deleted: true}));
};

