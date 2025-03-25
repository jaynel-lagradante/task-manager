import axios from 'axios';
import { User } from '../types/UserInterface';
import { API_ENDPOINTS } from '../constants/Api';
import { MESSAGES } from '../constants/Messages';

export const Login = async (credentials: { username: string; password: string }) => {
    try {
        const response = await axios.post(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.LOGIN}`, credentials);
        setUserInfo(response.data);
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
        const response = await axios.post(`${API_ENDPOINTS.BASE}${API_ENDPOINTS.LOGIN_GOOGLE}`, { code });
        setUserInfo(response.data);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.LOGIN, error);
        throw error;
    }
};

export const Logout = () => {
    localStorage.removeItem('token');
};

const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(atob(base64));
        return decodedPayload;
    } catch (error) {
        console.error(MESSAGES.ERROR.DECODING_JWT, error);
        return null;
    }
};

const setUserInfo = (data: User) => {
    if (data.token) {
        const token = data.token;
        localStorage.setItem('username', decodeJWT(data.token).username);
        localStorage.setItem('token', token);
    }
};
