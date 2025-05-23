import { Request, Response } from 'express';
import Task from '../models/Task';
import { v4 as uuidv4 } from 'uuid';
import Subtask from '../models/Subtask';
import File from '../models/File';
import {
    MESSAGE_TASK_CREATED_SUCCESSFULLY,
    MESSAGE_INTERNAL_SERVER_ERROR,
    MESSAGE_TASK_NOT_FOUND,
    MESSAGE_TASK_UPDATED_SUCCESSFULLY,
    MESSAGE_TASK_DELETED_SUCCESSFULLY,
} from '../config/messages';
import { verify } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
interface JWTPayload {
    id: string;
    username: string;
    iat?: number;
    exp?: number;
}

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, due_date, priority, status, description, attachments } = req.body;
        const userId = (req.user as any).id;
        const id = uuidv4();
        const createdAt = new Date();

        await Task.create({
            id,
            title,
            due_date,
            priority,
            status,
            description,
            attachments,
            user_id: userId,
            created_at: createdAt,
        });
        res.status(201).json({ message: MESSAGE_TASK_CREATED_SUCCESSFULLY, id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        const tasks = await Task.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Subtask,
                    as: 'subtasks',
                },
            ],
        });

        const tasksWithAttachment = await Promise.all(
            tasks.map(async (task) => {
                const hasAttachment = await File.findOne({
                    where: { task_id: task.id },
                });
                return {
                    ...task.toJSON(),
                    hasAttachment: !!hasAttachment,
                };
            })
        );

        res.json(tasksWithAttachment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Missing authentication token' });
        }

        try {
            const decoded = verify(token, JWT_SECRET!) as JWTPayload;
            const userIdFromToken = decoded.id;
            const task = await Task.findByPk(id);
            if (task) {
                if (task.user_id === userIdFromToken) {
                    res.json(task);
                } else {
                    res.status(404).json({ message: 'Forbidden: Task does not belong to this user' });
                }
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            return res.status(401).json({ message: 'Unauthorized: Invalid authentication token' });
        }
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, due_date, priority, status, description, attachments, date_completed } = req.body;
        await Task.update(
            { title, due_date, priority, status, description, attachments, updated_at: new Date(), date_completed },
            { where: { id } }
        );
        res.json({ message: MESSAGE_TASK_UPDATED_SUCCESSFULLY });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Subtask.destroy({ where: { task_id: id } });
        await File.destroy({ where: { task_id: id } });
        await Task.destroy({ where: { id } });
        res.json({ message: MESSAGE_TASK_DELETED_SUCCESSFULLY });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};
