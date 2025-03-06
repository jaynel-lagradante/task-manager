import express from 'express';
import { createSubtasks, deleteSubtask, getSubtasks, updateSubtasks } from '../controllers/subtaskController';

const router = express.Router();

router.post('/', createSubtasks);
router.get('/:taskId', getSubtasks);
router.put('/', updateSubtasks);
router.delete('/:id', deleteSubtask);

export default router;