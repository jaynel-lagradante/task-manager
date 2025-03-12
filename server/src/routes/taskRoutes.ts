import express from 'express';
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from '../controllers/taskController';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
