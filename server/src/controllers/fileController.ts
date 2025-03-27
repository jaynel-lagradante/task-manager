import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import File from '../models/File';
import {
    MESSAGE_NO_FILES_UPLOADED,
    MESSAGE_FILES_UPLOADED_SUCCESSFULLY,
    MESSAGE_INTERNAL_SERVER_ERROR,
    MESSAGE_INVALID_FILE_IDS_PROVIDED,
    MESSAGE_NO_FILES_FOUND_WITH_IDS,
    MESSAGE_FILES_DELETED_SUCCESSFULLY,
} from '../config/messages';

export const uploadFiles = async (req: Request, res: Response): Promise<any> => {
    try {
        const { taskId } = req.params;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(201).json({ message: MESSAGE_NO_FILES_UPLOADED });
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

        return res.status(201).json({ message: MESSAGE_FILES_UPLOADED_SUCCESSFULLY });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
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
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};

export const deleteFilesByIds = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fileIds } = req.body;

        if (!Array.isArray(fileIds) || fileIds.length === 0) {
            res.status(400).json({ message: MESSAGE_INVALID_FILE_IDS_PROVIDED });
            return;
        }

        const deletedFilesCount = await File.destroy({
            where: {
                id: fileIds,
            },
        });

        if (deletedFilesCount === 0) {
            res.status(404).json({ message: MESSAGE_NO_FILES_FOUND_WITH_IDS });
            return;
        }

        res.status(200).json({ message: MESSAGE_FILES_DELETED_SUCCESSFULLY(deletedFilesCount) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};
