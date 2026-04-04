import express, { type Application, type Request, type Response } from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './Routes/user.routes';
import geminiRoutes from './Routes/gemini.routes';

// Middleware
const app: Application = express();

app.use(cors({
    origin: (_origin, callback) => callback(null, true),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'cache-control', 'remember-me'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

/**
 * @route test router
 */
app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Server is running" })
})

app.use('/api/users', userRoutes);
app.use('/api/ai', geminiRoutes);

export default app;