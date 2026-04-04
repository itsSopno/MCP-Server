"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const server_1 = require("./server");
const database_1 = __importDefault(require("../Config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
async function main() {
    try {
        await (0, database_1.default)();
        const transport = new stdio_js_1.StdioServerTransport();
        await server_1.server.connect(transport);
    }
    catch (error) {
        console.error("Fatal error in MCP stdio server:", error);
        process.exit(1);
    }
}
main();
