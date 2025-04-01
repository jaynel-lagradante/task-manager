import axios from 'axios';
import { User } from '../types/UserInterface';
import { API_ENDPOINTS } from '../constants/Api';
import { MESSAGES } from '../constants/Messages';
import api from '../utils/Interceptors';

export const Login = async (credentials: { username: string; password: string }) => {
    try {
        const response = await api.post(`${API_ENDPOINTS.LOGIN}`, credentials);
        localStorage.setItem('username', response.data.account.username);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.LOGIN, error);
        throw error;
    }
};

export const Register = async (credentials: { username: string; password: string }) => {
    try {
        const response = await axios.post(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.REGISTER}`, credentials);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.REGISTER, error);
        throw error;
    }
};

export const GoogleAuth = async (code: string) => {
    try {
        const response = await api.post(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.LOGIN_GOOGLE}`, { code });
        localStorage.setItem('username', response.data.account.username);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.LOGIN, error);
        throw error;
    }
};

export const Logout = async () => {
    try {
        const response = await api.post(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.LOGOUT}`);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.LOGOUT, error);
        throw error;
    }
};
