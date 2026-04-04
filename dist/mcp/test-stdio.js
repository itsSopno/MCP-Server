"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const path_1 = __importDefault(require("path"));
async function test() {
    const transport = new stdio_js_1.StdioClientTransport({
        command: "npx",
        args: ["ts-node", path_1.default.resolve(__dirname, "stdio.ts")],
    });
    const client = new index_js_1.Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    await client.connect(transport);
    console.log("Listing tools...");
    const tools = await client.listTools();
    console.log(JSON.stringify(tools, null, 2));
    console.log("Calling get_user_profile...");
    const profile = await client.callTool({ name: "get_user_profile", arguments: {} });
    console.log(JSON.stringify(profile, null, 2));
    process.exit(0);
}
test().catch(console.error);
