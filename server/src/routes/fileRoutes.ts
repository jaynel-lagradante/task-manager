import express from 'express';
import { uploadFiles } from '../controllers/fileController';

const router = express.Router();

router.post('/:taskId', uploadFiles); // Remove multer from here

export default router;
