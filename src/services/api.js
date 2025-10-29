import axios from 'axios';

// Boa prática seria isolar os services (login etc). Isto pode ser refatorado mais tarde

const API_BASE = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: (token) =>
    api.get('/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    }),
};

export const apostilaAPI = {
  createApostila: (data) => api.post('/apostilas', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    }, data
  }),
  updateEditedApostila: (id, file) => api.put('/apostilas/edit', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    }, data: { id, file }
  }),
  getEditedApostila: (id) => api.get('/apostilas/edited_html', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    },
    params: { id }
  }),
}

export default api;
