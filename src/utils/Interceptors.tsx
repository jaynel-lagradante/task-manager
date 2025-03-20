import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.error('Unauthorized! Redirecting to login...');
                localStorage.removeItem('token');
            } else if (error.response.status === 403) {
                console.error('Forbidden access.');
                localStorage.removeItem('token');
            } else if (error.response.status === 500) {
                console.error('Server error. Please try again later.');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
