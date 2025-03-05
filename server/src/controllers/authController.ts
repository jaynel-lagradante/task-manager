import { Request, Response } from 'express';
import Account from '../models/Account';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
// import passport from 'passport';

dotenv.config();

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required" });
            return;
        }
        
        const account = await Account.findOne({ where: { username } });
        if (!account) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const passwordMatch = await bcrypt.compare(password, account.password);

        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required" });
            return;
        }
        // Check if username already exists
        const existingUser = await Account.findOne({ where: { username } });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exist' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        await Account.create({ id, username, password: hashedPassword, created_at: new Date() });
        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// export const googleAuth = (req: Request, res: Response) => {
//     const token = jwt.sign({ id: (req.user as any).id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
//     res.redirect(`http://localhost:3000/login?token=${token}`);
// };

// export const facebookAuth = (req: Request, res: Response) => {
//     const token = jwt.sign({ id: (req.user as any).id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
//     res.redirect(`http://localhost:3000/login?token=${token}`);
// };