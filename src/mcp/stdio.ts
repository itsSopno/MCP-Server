import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server";
import connectDB from "../Config/database";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function main() {
  try {
    await connectDB();
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Fatal error in MCP stdio server:", error);
    process.exit(1);
  }
}

main();
