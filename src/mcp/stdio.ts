/**
 * MCP Output Isolation Patch
 * Redirects all non-JSON-RPC output to stderr to prevent tool registration failure.
 */
const originalStdoutWrite = process.stdout.write;
(process.stdout.write as any) = function (chunk: any, encoding?: any, callback?: any) {
  const str = typeof chunk === "string" ? chunk : chunk.toString();
  // Only allow valid JSON-RPC messages (starting with {) to go to stdout
  if (str.trim().startsWith("{")) {
    return originalStdoutWrite.apply(process.stdout, [chunk, encoding, callback]);
  }
  return process.stderr.write.apply(process.stderr, [chunk, encoding, callback]);
};

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./server";
import connectDB from "../Config/database";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function main() {
  try {
    await connectDB();
    const transport = new StdioServerTransport();
    await createMcpServer().connect(transport);
  } catch (error) {
    console.error("Fatal error in MCP stdio server:", error);
    process.exit(1);
  }
}

main();
