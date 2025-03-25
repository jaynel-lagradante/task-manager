import { Subtask } from './../types/SubTaskInterface';
import api from '../utils/Interceptors';
import { API_ENDPOINTS } from '../constants/Api';
import { MESSAGES } from '../constants/Messages';

export const getSubtasks = async (taskId: string) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.SUBTASKS}/${taskId}`);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.GET_SUBTASKS, error);
        throw error;
    }
};

export const createSubtasks = async (taskId: string, subtasks: Subtask[]) => {
    try {
        const response = await api.post(`${API_ENDPOINTS.SUBTASKS}`, { taskId, subtasks });
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.CREATE_SUBTASK, error);
        throw error;
    }
};

export const updateSubtasks = async (subtasks: Subtask[]) => {
    try {
        const response = await api.put(`${API_ENDPOINTS.SUBTASKS}`, { subtasks });
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.UPDATE_SUBTASK, error);
        throw error;
    }
};

export const deleteSubtask = async (id: string) => {
    try {
        const response = await api.delete(`${API_ENDPOINTS.SUBTASKS}/${id}`);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.DELETE_SUBTASK, error);
        throw error;
    }
};
