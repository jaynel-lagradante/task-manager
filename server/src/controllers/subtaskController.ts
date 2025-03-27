import { Request, Response } from 'express';
import Subtask from '../models/Subtask';
import { v4 as uuidv4 } from 'uuid';
import {
    MESSAGE_SUBTASKS_MUST_BE_ARRAY,
    MESSAGE_NO_VALID_SUBTASKS_PROVIDED,
    MESSAGE_SUBTASKS_CREATED_SUCCESSFULLY,
    MESSAGE_INTERNAL_SERVER_ERROR,
    MESSAGE_NO_VALID_SUBTASKS_FOR_UPDATE,
    MESSAGE_SUBTASKS_UPDATED_SUCCESSFULLY,
    MESSAGE_INVALID_SUBTASK_IDS_PROVIDED,
    MESSAGE_NO_SUBTASKS_FOUND_WITH_IDS,
    MESSAGE_SUBTASKS_DELETED_SUCCESSFULLY,
} from '../config/messages';

export const createSubtasks = async (req: Request, res: Response) => {
    try {
        const { subtasks, taskId } = req.body;

        if (!Array.isArray(subtasks)) {
            res.status(400).json({ message: MESSAGE_SUBTASKS_MUST_BE_ARRAY });
            return;
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

        const filteredSubtasks = createdSubtasks.filter((subtask) => subtask !== null); // Remove null values

        if (filteredSubtasks.length === 0) {
            res.status(400).json({ message: MESSAGE_NO_VALID_SUBTASKS_PROVIDED });
            return;
        }

        res.status(201).json({ message: MESSAGE_SUBTASKS_CREATED_SUCCESSFULLY, createdSubtasks: filteredSubtasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};

export const getSubtasks = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const subtasks = await Subtask.findAll({ where: { task_id: taskId } });
        res.json(subtasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};

export const updateSubtasks = async (req: Request, res: Response) => {
    try {
        const { subtasks } = req.body;

        if (!Array.isArray(subtasks)) {
            res.status(400).json({ message: MESSAGE_SUBTASKS_MUST_BE_ARRAY });
            return;
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

        const filteredSubtasks = updatedSubtasks.filter((subtask) => subtask !== null); // Remove null values

        if (filteredSubtasks.length === 0) {
            res.status(400).json({ message: MESSAGE_NO_VALID_SUBTASKS_FOR_UPDATE });
            return;
        }

        res.json({ message: MESSAGE_SUBTASKS_UPDATED_SUCCESSFULLY, updatedSubtasks: filteredSubtasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};

export const deleteSubtasks = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ message: MESSAGE_INVALID_SUBTASK_IDS_PROVIDED });
            return;
        }

        const deletedCount = await Subtask.destroy({
            where: {
                id: ids,
            },
        });

        if (deletedCount === 0) {
            res.status(404).json({ message: MESSAGE_NO_SUBTASKS_FOUND_WITH_IDS });
            return;
        }

        res.json({ message: MESSAGE_SUBTASKS_DELETED_SUCCESSFULLY(deletedCount) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};
