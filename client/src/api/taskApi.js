import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request Interceptor: attach JWT from localStorage ─────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response Interceptor: normalise errors ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const fetchTasks = (params = {}) => api.get('/tasks', { params }).then(r => r.data);
export const fetchTaskById = (id) => api.get(`/tasks/${id}`).then(r => r.data);
export const createTask = (data) => api.post('/tasks', data).then(r => r.data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then(r => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(r => r.data);
export const fetchMetadata = () => api.get('/tasks/metadata').then(r => r.data);
export const addCustomList = (list) => api.post('/tasks/metadata/list', { list }).then(r => r.data);
export const addCustomTag = (tag) => api.post('/tasks/metadata/tag', { tag }).then(r => r.data);
export const clearCompletedTasks = () => api.delete('/tasks/clear-completed').then(r => r.data);
