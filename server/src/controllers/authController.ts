import { Request, Response } from 'express';
import Account from '../models/Account';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { ALLOWED_USERNAME_SYMBOLS, JWT_EXPIRATION_TIME, APPLICATION_URI, GOOGLE_OAUTH2_URI } from '../config/constants';
import {
    MESSAGE_USERNAME_PASSWORD_REQUIRED,
    MESSAGE_INVALID_CREDENTIALS,
    MESSAGE_USERNAME_INVALID_CHARACTERS,
    MESSAGE_USERNAME_ALREADY_EXISTS,
    MESSAGE_ACCOUNT_CREATED_SUCCESSFULLY,
    MESSAGE_INVALID_TOKEN,
    MESSAGE_GOOGLE_TOKEN_VERIFICATION_ERROR,
    MESSAGE_LOGGED_OUT_SUCCESSFULLY,
    MESSAGE_INTERNAL_SERVER_ERROR,
    MESSAGE_INTERNAL_SERVER_ERROR_LOGOUT,
} from '../config/messages';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const maxAge = 60 * 60 * 1000; // 1hour

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: MESSAGE_USERNAME_PASSWORD_REQUIRED });
            return;
        }

        const account = await Account.findOne({ where: { username } });
        if (!account) {
            res.status(401).json({ message: MESSAGE_INVALID_CREDENTIALS });
            return;
        }
        if (account.password) {
            const passwordMatch = await bcrypt.compare(password, account.password);
            if (!passwordMatch) {
                res.status(401).json({ message: MESSAGE_INVALID_CREDENTIALS });
                return;
            }
        }

        const token = jwt.sign({ id: account.id, username }, JWT_SECRET!, {
            expiresIn: JWT_EXPIRATION_TIME,
        });
        await Account.update({ active_token: token }, { where: { id: account.id } });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge,
            path: '/',
        });

        res.json({ account });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: MESSAGE_USERNAME_PASSWORD_REQUIRED });
            return;
        }

        // Validate username against allowed symbols
        if (!ALLOWED_USERNAME_SYMBOLS.test(username)) {
            res.status(400).json({ message: MESSAGE_USERNAME_INVALID_CHARACTERS });
            return;
        }

        // Check if username already exists
        const existingUser = await Account.findOne({ where: { username } });
        if (existingUser) {
            res.status(400).json({ message: MESSAGE_USERNAME_ALREADY_EXISTS });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        await Account.create({ id, username, password: hashedPassword, created_at: new Date() });
        res.status(201).json({ message: MESSAGE_ACCOUNT_CREATED_SUCCESSFULLY });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR });
    }
};

export const signInUsingGoogle = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const userInfo = await axios.post(GOOGLE_OAUTH2_URI, {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: APPLICATION_URI,
        });

        const { id_token } = userInfo.data;

        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            res.status(401).json({ message: MESSAGE_INVALID_TOKEN });
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

        const token = jwt.sign({ id: account.id, username: payload.name }, JWT_SECRET!, {
            expiresIn: JWT_EXPIRATION_TIME,
        });
        await Account.update({ active_token: token }, { where: { id: account.id } });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge,
            path: '/',
        });
        res.json({ account });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: MESSAGE_GOOGLE_TOKEN_VERIFICATION_ERROR });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('authToken', { path: '/' });
        const tokenFromCookie = req.cookies.authToken;
        if (tokenFromCookie) {
            try {
                const decodedToken: any = jwt.verify(tokenFromCookie, process.env.JWT_SECRET!);
                if (decodedToken && decodedToken.id) {
                    await Account.update({ active_token: null }, { where: { id: decodedToken.id } });
                }
            } catch (jwtError) {
                console.error(jwtError);
            }
        }

        res.status(200).json({ message: MESSAGE_LOGGED_OUT_SUCCESSFULLY });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MESSAGE_INTERNAL_SERVER_ERROR_LOGOUT });
    }
};
