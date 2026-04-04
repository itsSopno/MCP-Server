"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Standard .env loading at the top
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const index_1 = __importDefault(require("../index"));
const database_1 = __importDefault(require("../Config/database"));
const PORT = process.env.PORT || 10001;
const server = (0, http_1.createServer)(index_1.default);
const startServer = async () => {
    try {
        await (0, database_1.default)();
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
