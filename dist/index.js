"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const server_1 = require("./mcp/server");
// Middleware
const app = (0, express_1.default)();
// Set up SSE transport for MCP
const mcpTransports = new Map();
app.get("/mcp", async (req, res) => {
    console.error("New MCP SSE connection request");
    const transport = new sse_js_1.SSEServerTransport("/messages", res);
    const sessionId = transport.sessionId;
    mcpTransports.set(sessionId, transport);
    const server = (0, server_1.createMcpServer)();
    server.connect(transport).catch((error) => {
        console.error(`MCP connection error for session ${sessionId}:`, error);
        mcpTransports.delete(sessionId);
    });
    res.on("close", () => {
        console.error(`MCP SSE connection closed for session ${sessionId}`);
        mcpTransports.delete(sessionId);
    });
});
app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = mcpTransports.get(sessionId);
    if (transport) {
        await transport.handlePostMessage(req, res);
    }
    else {
        res.status(400).json({ error: "Invalid session ID or session expired" });
    }
});
app.use((0, cors_1.default)({
    origin: (_origin, callback) => callback(null, true),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With", "cache-control", "remember-me"],
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
/**
 * @route test router
 */
app.get("/", (_req, res) => {
    res.json({ message: "Server is running" });
});
exports.default = app;
