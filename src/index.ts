import express, { type Application, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createMcpServer } from "./mcp/server";

// Middleware
const app: Application = express();

// Set up SSE transport for MCP
const mcpTransports = new Map<string, SSEServerTransport>();

app.get("/mcp", async (req: Request, res: Response) => {
  console.error("New MCP SSE connection request");

  const transport = new SSEServerTransport("/messages", res);
  const sessionId = transport.sessionId;
  mcpTransports.set(sessionId, transport);

  const server = createMcpServer();

  server.connect(transport).catch((error) => {
    console.error(`MCP connection error for session ${sessionId}:`, error);
    mcpTransports.delete(sessionId);
  });

  res.on("close", () => {
    console.error(`MCP SSE connection closed for session ${sessionId}`);
    mcpTransports.delete(sessionId);
  });
});

app.post("/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = mcpTransports.get(sessionId);

  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).json({ error: "Invalid session ID or session expired" });
  }
});

app.use(cors({
  origin: (_origin, callback) => callback(null, true),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With", "cache-control", "remember-me"],
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/**
 * @route test router
 */
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

export default app;