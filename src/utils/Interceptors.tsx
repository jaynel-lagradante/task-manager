import axios from 'axios';
import { useLoadingState } from '../state/LoadingState';
import { useAuthState } from '../state/AuthState';
import { API_ENDPOINTS } from '../constants/Api';
import { MESSAGES } from '../constants/Messages';

const api = axios.create({
    baseURL: API_ENDPOINTS.BASE,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});
const { setLoading } = useLoadingState.getState();
const { setToken, setAuth } = useAuthState.getState();

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const BEARER_TOKEN = `Bearer ${token}`;
        setLoading(true);
        if (token) {
            config.headers.Authorization = BEARER_TOKEN;
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
            if (error.response.status === 401 || error.response.status === 403) {
                console.error(MESSAGES.ERROR.UNAUTHORIZED);
                localStorage.removeItem('token');
                setAuth(false);
                setToken(false);
            } else if (error.response.status === 500) {
                console.error(MESSAGES.ERROR.NETWORK);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
