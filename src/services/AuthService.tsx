import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/auth';

export const Login = async (credentials: { username: string; password: string }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        localStorage.setItem('token', response.data.token);
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

export const Logout = () => {
    localStorage.removeItem('token');
};