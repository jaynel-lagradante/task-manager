import express from 'express';
import { login, register, signInUsingGoogle } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/google', signInUsingGoogle);

export default router;