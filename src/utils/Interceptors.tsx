import axios from 'axios';
import { useLoadingState } from '../state/LoadingState';

const api = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});
const { setLoading } = useLoadingState.getState();

api.interceptors.request.use(
    (config) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        setLoading(false);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        setLoading(false);
        return response;
    },
    async (error) => {
        setLoading(false);
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
