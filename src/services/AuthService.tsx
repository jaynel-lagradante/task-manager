import axios from 'axios';
import { User } from '../types/UserInterface';

const API_BASE_URL = 'http://localhost:5000/auth';

export const Login = async (credentials: { username: string; password: string }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        setUserInfo(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const Register = async (credentials: { username: string; password: string }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GoogleAuth = async (code: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/google`, { code });
        setUserInfo(response.data);
        return response.data;
    } catch (error) {
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
        console.error('Error decoding JWT:', error);
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
