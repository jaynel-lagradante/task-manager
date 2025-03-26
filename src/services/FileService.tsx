import { API_ENDPOINTS } from '../constants/Api';
import { MESSAGES } from '../constants/Messages';
import api from '../utils/Interceptors';

export const UploadFiles = async (taskId: string, files: File[]) => {
    try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        await api.post(`${API_ENDPOINTS.FILES}/${taskId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    } catch (error) {
        console.error(MESSAGES.ERROR.UPLOAD_FILE, error);
        throw error;
    }
};

export const GetFiles = async (taskId: string) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.FILES}/${taskId}`);
        return response.data;
    } catch (error) {
        console.error(MESSAGES.ERROR.GET_FILE, error);
        throw error;
    }
};

export const DeleteFiles = async (fileIds: string[]) => {
    try {
        await api.delete(API_ENDPOINTS.FILES, {
            data: { fileIds },
        });
    } catch (error) {
        console.error(MESSAGES.ERROR.DELETE_FILE, error);
        throw error;
    }
};
