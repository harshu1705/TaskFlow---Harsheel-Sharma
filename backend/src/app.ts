import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/', taskRoutes); // Mounted at root intercepting /projects/:id/tasks and /tasks/:id

// Healthcheck Route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'TaskFlow API is running' });
});

// Basic Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
