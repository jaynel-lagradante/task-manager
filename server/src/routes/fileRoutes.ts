import express from 'express';
import multer from 'multer';
import { uploadFiles, getFilesByTaskId, deleteFileById } from '../controllers/fileController';

const router = express.Router();
const upload = multer();

router.post('/:taskId', upload.array('files', 10), uploadFiles);
router.get('/:taskId', getFilesByTaskId);
router.delete('/:fileId', deleteFileById);

export default router;
