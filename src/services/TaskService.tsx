import { API_ENDPOINTS } from '../constants/Api';
import { MESSAGES } from '../constants/Messages';
import { Task } from '../types/TaskInterface';
import api from '../utils/Interceptors';

export const CreateTask = async (taskData: Task) => {
    try {
        const formData = { ...taskData, due_date: taskData.due_date?.format('YYYY-MM-DD') };
        const response = await api.post(`${API_ENDPOINTS.TASKS}`, formData);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.CREATE_TASK, error);
        throw error;
    }
};

export const GetTasks = async (): Promise<Task[]> => {
    try {
        const response = await api.get(`${API_ENDPOINTS.TASKS}`);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.GET_TASKS, error);
        throw error;
    }
};

export const GetTaskById = async (taskId: string): Promise<Task> => {
    try {
        const response = await api.get(`${API_ENDPOINTS.TASKS}/${taskId}`);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.GET_TASKS, error);
        throw error;
    }
};

export const UpdateTask = async (taskId: string, taskData: Task) => {
    try {
        const formData = { ...taskData, due_date: taskData.due_date?.format('YYYY-MM-DD') };
        const response = await api.put(`${API_ENDPOINTS.TASKS}/${taskId}`, formData);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.UPDATE_TASK, error);
        throw error;
    }
};

export const DeleteTask = async (taskId: string) => {
    try {
        await api.delete(`${API_ENDPOINTS.TASKS}/${taskId}`);
    } catch (error) {
        console.error(MESSAGES.ERROR.DELETE_TASK, error);
        throw error;
    }
};
