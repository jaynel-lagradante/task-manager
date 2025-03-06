import { Request, Response } from 'express';
import Subtask from '../models/Subtask';
import { v4 as uuidv4 } from 'uuid';

export const createSubtasks = async (req: Request, res: Response) => {
    try {
        const { subtasks, taskId } = req.body;

        if (!Array.isArray(subtasks)) {
            res.status(400).json({ message: 'Subtasks must be an array' });
        }

        const createdSubtasks = await Promise.all(
            subtasks.map(async (subtaskData: { title: string; status: string }) => {
                if (!subtaskData.title || subtaskData.title.trim() === '') {
                    return null; 
                }
                const id = uuidv4();
                return Subtask.create({ id, title: subtaskData.title, status: subtaskData.status, task_id: taskId });
            })
        );

        const filteredSubtasks = createdSubtasks.filter(subtask => subtask !== null); // Remove null values

        if (filteredSubtasks.length === 0) {
            res.status(400).json({ message: 'No valid subtasks provided' });
        }

        res.status(201).json({ message: 'Subtasks created successfully', createdSubtasks: filteredSubtasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSubtasks = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const subtasks = await Subtask.findAll({ where: { task_id: taskId } });
        res.json(subtasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSubtasks = async (req: Request, res: Response) => {
    try {
        const { subtasks } = req.body;

        if (!Array.isArray(subtasks)) {
            res.status(400).json({ message: 'Subtasks must be an array' });
        }

        const updatedSubtasks = await Promise.all(
            subtasks.map(async (subtaskData: { id: string; title: string; status: string }) => {
                const { id, title, status } = subtaskData;
                if (!id) {
                    return null; 
                }
                const subtask = await Subtask.findByPk(id);
                if (!subtask) {
                    return null;
                }
                await subtask.update({ title, status });
                return subtask;
            })
        );

        const filteredSubtasks = updatedSubtasks.filter(subtask => subtask !== null); // Remove null values

        if (filteredSubtasks.length === 0) {
            res.status(400).json({ message: 'No valid subtasks provided for update' });
        }

        res.json({ message: 'Subtasks updated successfully', updatedSubtasks: filteredSubtasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSubtask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Subtask.destroy({ where: { id } });
        res.json({ message: 'Subtask deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};