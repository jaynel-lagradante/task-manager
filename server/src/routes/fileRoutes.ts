import express from 'express';
import multer from 'multer';
import { uploadFiles, getFilesByTaskId, deleteFilesByIds } from '../controllers/fileController';

const router = express.Router();
const upload = multer();

router.post('/:taskId', upload.array('files', 10), uploadFiles);
router.get('/:taskId', getFilesByTaskId);
router.delete('/', deleteFilesByIds);

export default router;
