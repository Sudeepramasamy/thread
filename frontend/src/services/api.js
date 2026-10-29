import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('thread_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for centralized error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 on admin route, clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('thread_admin_token');
        localStorage.removeItem('thread_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
