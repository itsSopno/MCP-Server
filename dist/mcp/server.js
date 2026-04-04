"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMcpServer = createMcpServer;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const project_model_1 = __importDefault(require("../Model/ProjectDetails/project.model"));
const Tools_1 = require("./Tools"); // modular tools ইম্পোর্ট করা হলো
function createMcpServer() {
    const server = new index_js_1.Server({
        name: "portfolio-knowledge-base",
        version: "1.0.0",
    }, {
        capabilities: {
            resources: {},
            tools: {},
        },
    });
    server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
        return {
            resources: [
                {
                    uri: "user://profile",
                    name: "User Profile",
                    mimeType: "application/json",
                    description: "Basic profile information including name, bio, and skills.",
                },
            ],
        };
    });
    server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
        if (request.params.uri === "user://profile") {
            const user = await project_model_1.default.findOne();
            if (!user) {
                throw new Error("User profile not found in database.");
            }
            return {
                contents: [
                    {
                        uri: "user://profile",
                        mimeType: "application/json",
                        text: JSON.stringify(user, null, 2),
                    },
                ],
            };
        }
        throw new Error(`Resource not found: ${request.params.uri}`);
    });
    // অটোমেটিক সব টুল লিস্ট করার জন্য
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
        return {
            tools: Tools_1.tools.map((tool) => ({
                name: tool.name,
                description: tool.description,
                inputSchema: tool.inputSchema,
            })),
        };
    });
    // অটোমেটিক সঠিক টুলটির হেন্ডলার কল করার জন্য
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            const tool = Tools_1.tools.find((t) => t.name === name);
            if (tool) {
                return await tool.handler(args);
            }
            throw new Error(`Tool not found: ${name}`);
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    });
    return server;
}
