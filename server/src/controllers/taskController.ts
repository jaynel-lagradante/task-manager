import { Request, Response } from 'express';
import Task from '../models/Task';
import { v4 as uuidv4 } from 'uuid';
import Subtask from '../models/Subtask';

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
        res.status(201).json({ message: 'Task created successfully', id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error(error);
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
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Task.destroy({ where: { id } });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
