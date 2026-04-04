import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";

// Standard .env loading at the top
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import app from "../index";
import connectDB from "../Config/database";

const PORT = process.env.PORT || 10001;

const server = createServer(app);

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();