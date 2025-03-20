import { Subtask } from './../types/SubTaskInterface';
import api from '../utils/Interceptors';

const API_URL = 'subtasks';

export const getSubtasks = async (taskId: string) => {
    try {
        const response = await api.get(`${API_URL}/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subtasks:', error);
        throw error;
    }
};

export const createSubtasks = async (taskId: string, subtasks: Subtask[]) => {
    try {
        const response = await api.post(`${API_URL}`, { taskId, subtasks });
        return response.data;
    } catch (error) {
        console.error('Error creating subtasks:', error);
        throw error;
    }
};

export const updateSubtasks = async (subtasks: Subtask[]) => {
    try {
        const response = await api.put(`${API_URL}`, { subtasks });
        return response.data;
    } catch (error) {
        console.error('Error updating subtasks:', error);
        throw error;
    }
};

export const deleteSubtask = async (id: string) => {
    try {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting subtask:', error);
        throw error;
    }
};
