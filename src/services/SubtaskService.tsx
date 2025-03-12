import axios from 'axios';
import { Subtask } from './../types/SubTaskInterface';

const API_URL = 'http://localhost:5000/subtasks'; // Replace with your API URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getSubtasks = async (taskId: string) => {
    try {
        const response = await axios.get(`${API_URL}/${taskId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching subtasks:', error);
        throw error; // Re-throw the error for the component to handle
    }
};

export const createSubtasks = async (taskId: string, subtasks: Subtask[]) => {
    try {
        const response = await axios.post(
            `${API_URL}`,
            { taskId, subtasks },
            {
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating subtasks:', error);
        throw error;
    }
};

export const updateSubtasks = async (subtasks: Subtask[]) => {
    try {
        const response = await axios.put(
            `${API_URL}`,
            { subtasks },
            {
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating subtasks:', error);
        throw error;
    }
};

export const deleteSubtask = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting subtask:', error);
        throw error;
    }
};
