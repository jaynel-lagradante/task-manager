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

export const GoogleAuth = async (token: string) => {
    try {
        const userInfo = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            { headers: { Authorization: `Bearer ${token}` } }
          );
        const response = await axios.post(`${API_BASE_URL}/google`, { userInfo });
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const Logout = () => {
    localStorage.removeItem('token');
};