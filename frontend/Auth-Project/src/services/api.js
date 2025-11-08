import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/auth',
});

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:8000/api/auth/refresh', { 
            refreshToken 
          });
          const newToken = response.data.accessToken;
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => API.post('/register', userData),
  login: (userData) => API.post('/login', userData),
  getProfile: () => API.get('/profile'),
  updateProfile: (userData) => API.put('/profile', userData),
  refreshToken: (refreshToken) => API.post('/refresh', { refreshToken }),
};

export default API;