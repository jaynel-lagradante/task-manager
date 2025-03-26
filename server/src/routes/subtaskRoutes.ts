import express from 'express';
import { createSubtasks, deleteSubtasks, getSubtasks, updateSubtasks } from '../controllers/subtaskController';

const router = express.Router();

router.post('/', createSubtasks);
router.get('/:taskId', getSubtasks);
router.put('/', updateSubtasks);
router.delete('/', deleteSubtasks);

export default router;
