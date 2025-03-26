import express from 'express';
import { login, logout, register, signInUsingGoogle } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/google', signInUsingGoogle);
router.post('/logout', logout);

export default router;
