import { Request, Response } from 'express';
import Subtask from '../models/Subtask';
import { v4 as uuidv4 } from 'uuid';

export const createSubtask = async (req: Request, res: Response) => {
    try {
        const { title, status, taskId } = req.body;
        const id = uuidv4();
        await Subtask.create({ id, title, status, task_id: taskId });
        res.status(201).json({ message: 'Subtask created successfully' });
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

export const updateSubtask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, status } = req.body;
        await Subtask.update({ title, status }, { where: { id } });
        res.json({ message: 'Subtask updated successfully' });
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