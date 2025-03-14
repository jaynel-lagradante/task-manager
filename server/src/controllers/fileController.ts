import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import File from '../models/File';

export const uploadFiles = async (req: Request, res: Response): Promise<any> => {
    try {
        const { taskId } = req.params;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const fileUploadPromises = files.map(async (file) => {
            const { originalname, buffer } = file;
            const id = uuidv4();
            const createdAt = new Date();

            await File.create({
                id,
                task_id: taskId,
                file_name: originalname,
                file_data: buffer,
                created_at: createdAt,
            });
        });

        await Promise.all(fileUploadPromises);

        return res.status(201).json({ message: 'Files uploaded successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getFilesByTaskId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskId } = req.params;

        const files = await File.findAll({
            where: {
                task_id: taskId,
            },
            attributes: ['id', 'file_name', 'created_at', 'file_data'],
        });

        res.status(200).json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteFileById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fileId } = req.params;

        const deletedFile = await File.destroy({
            where: {
                id: fileId,
            },
        });

        if (deletedFile === 0) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
