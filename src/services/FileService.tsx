import api from '../utils/Interceptors';

const API_URL = 'files';

export const UploadFiles = async (taskId: string, files: File[]) => {
    try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        await api.post(`${API_URL}/${taskId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    } catch (error) {
        throw error;
    }
};

export const GetFiles = async (taskId: string) => {
    try {
        const response = await api.get(`${API_URL}/${taskId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteFile = async (fileId: string) => {
    try {
        await api.delete(`${API_URL}/${fileId}`);
    } catch (error) {
        throw error;
    }
};
