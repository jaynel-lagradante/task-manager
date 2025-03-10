import { Request, Response } from 'express';
import Account from '../models/Account';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library'; 
import axios from 'axios';

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
        if(account.password) {
            const passwordMatch = await bcrypt.compare(password, account.password);
            if (!passwordMatch) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
        }

        const token = jwt.sign({ id: account.id, username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
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

export const signInUsingGoogle = async (req: Request, res: Response) => {
    try { 
        const { code } = req.body;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const userInfo = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:3000', // Must match Google console settings
        });

        const {id_token} = userInfo.data;

        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }

        let account = await Account.findOne({ where: { google_id: payload.sub } });
        const username = payload.email || payload.name || 'GoogleUser';

        if (!account) {
            account = await Account.create({
                id: uuidv4(),
                username,
                google_id: payload.sub,
                created_at: new Date(),
            });
        }

        const jwtToken = jwt.sign({ id: account.id, username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({ token: jwtToken });
    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(401).json({ message: 'Error verifying Google token' });
    }
};