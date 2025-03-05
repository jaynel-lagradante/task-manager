// src/controllers/fileController.ts
import { Request, Response } from 'express';
import File from '../models/Files';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadFiles = async (req: Request, res: Response): Promise<any> => {
    upload.array('files', 10)(req, res, async (err) => { // Apply multer middleware here
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'File upload error' });
        }

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
    });
};