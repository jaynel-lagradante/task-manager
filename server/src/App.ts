import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import subtaskRoutes from './routes/subtaskRoutes';
import fileRoutes from './routes/fileRoutes';
import passport from 'passport';
import './auth/jwtStrategy'; // Initialize JWT strategy
import cors from 'cors';
// import './auth/googleStrategy'; // Initialize Google strategy
// import './auth/facebookStrategy'; // Initialize Facebook strategy

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow cookies and authorization headers
    // optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Use cors with options

// Sync database
sequelize.sync().then(() => {
    console.log('Database synced');
});

app.use('/auth', authRoutes);
app.use('/tasks', passport.authenticate('jwt', { session: false }), taskRoutes); // Protected routes
app.use('/subtasks', passport.authenticate('jwt', { session: false }), subtaskRoutes); // Protected routes
app.use('/upload', passport.authenticate('jwt', { session: false }), fileRoutes); // Protected routes
// app.use('/tasks', taskRoutes); // Protected routes
// app.use('/subtasks', subtaskRoutes); // Protected routes

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});