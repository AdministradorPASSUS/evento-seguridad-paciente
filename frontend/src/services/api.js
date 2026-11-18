import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  // baseURL: 'https://test-api-gesp.passus.cloud', 
  // baseURL: 'https://api-seguridadpaciente.passus.cloud', 


  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 1. Interceptor de peticiones (Añade el token a cada request)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor de respuestas (Detecta si el token expiró o no es válido)
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    // No tratar los errores del login como sesiones expiradas
    const esLogin = error.config?.url?.includes('/login');

    if (status === 401 && !esLogin) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha caducado por seguridad. Por favor, inicia sesión nuevamente.',
        confirmButtonColor: '#00933f',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        window.location.href = '/login';
      });
    }

    return Promise.reject(error);
  }
);

export default api;


