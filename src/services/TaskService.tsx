import { Task } from '../types/TaskInterface';
import api from '../utils/Interceptors';

const API_URL = 'tasks/';

export const CreateTask = async (taskData: Task) => {
    try {
        const formData = { ...taskData, due_date: taskData.due_date?.format('YYYY-MM-DD') };
        const response = await api.post(`${API_URL}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetTasks = async () => {
    try {
        const response = await api.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetTaskById = async (taskId: string) => {
    try {
        const response = await api.get(`${API_URL}/${taskId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UpdateTask = async (taskId: string, taskData: Task) => {
    try {
        const formData = { ...taskData, due_date: taskData.due_date?.format('YYYY-MM-DD') };
        const response = await api.put(`${API_URL}/${taskId}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteTask = async (taskId: string) => {
    try {
        await api.delete(`${API_URL}/${taskId}`);
    } catch (error) {
        throw error;
    }
};
