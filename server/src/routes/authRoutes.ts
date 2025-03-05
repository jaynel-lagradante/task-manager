import express from 'express';
import passport from 'passport';
// import { facebookAuth, googleAuth, login, register } from '../controllers/authController';
import { login, register } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuth);
// router.get('/facebook', passport.authenticate('facebook'));
// router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), facebookAuth);

export default router;