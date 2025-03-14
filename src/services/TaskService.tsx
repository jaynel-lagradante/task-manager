import axios from 'axios';
import { Task } from '../types/TaskInterface';

const API_BASE_URL = 'http://localhost:5000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const CreateTask = async (taskData: Task) => {
    try {
        const formData = { ...taskData, due_date: taskData.due_date?.format('YYYY-MM-DD') };
        const response = await axios.post(`${API_BASE_URL}/tasks`, formData, {
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetTasks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tasks`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetTaskById = async (taskId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateTask = async (taskId: string, taskData: Task) => {
    try {
        const formData = { ...taskData, due_date: taskData.due_date?.format('YYYY-MM-DD') };
        const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, formData, {
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteTask = async (taskId: string) => {
    try {
        await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        throw error;
    }
};

export const UploadFiles = async (taskId: string, files: File[]) => {
    try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        await axios.post(`${API_BASE_URL}/files/${taskId}`, formData, {
            headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
        });
    } catch (error) {
        throw error;
    }
};

export const GetFiles = async (taskId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/files/${taskId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteFile = async (fileId: string) => {
    try {
        await axios.delete(`${API_BASE_URL}/files/${fileId}`, {
            headers: getAuthHeaders(),
        });
    } catch (error) {
        throw error;
    }
};
