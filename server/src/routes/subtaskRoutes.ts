import express from 'express';
import { createSubtask, deleteSubtask, getSubtasks, updateSubtask } from '../controllers/subtaskController';

const router = express.Router();

router.post('/', createSubtask);
router.get('/:taskId', getSubtasks);
router.put('/:id', updateSubtask);
router.delete('/:id', deleteSubtask);

export default router;