import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import subtaskRoutes from './routes/subtaskRoutes';
import fileRoutes from './routes/fileRoutes';
import passport from 'passport';
import './auth/jwtStrategy';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

app.use(passport.initialize());
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));

sequelize.sync().then(() => {
    console.log('Database synced');
});

app.use('/auth', authRoutes);
app.use('/tasks', passport.authenticate('jwt', { session: false }), taskRoutes);
app.use('/subtasks', passport.authenticate('jwt', { session: false }), subtaskRoutes);
app.use('/files', passport.authenticate('jwt', { session: false }), fileRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
