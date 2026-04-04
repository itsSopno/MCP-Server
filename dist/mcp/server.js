"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMcpServer = createMcpServer;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const user_model_1 = __importDefault(require("../Model/UserDetails.Model/user.model"));
const project_model_1 = __importDefault(require("../Model/ProjectDetails/project.model"));
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
            const user = await user_model_1.default.findOne();
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
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: "get_user_profile",
                    description: "Get detailed information about the user (me), including skills, bio, and interests.",
                    inputSchema: {
                        type: "object",
                        properties: {},
                    },
                },
                {
                    name: "get_projects",
                    description: "Get a list of all projects with their titles, descriptions, and status.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            status: {
                                type: "string",
                                enum: ["active", "completed", "archived"],
                                description: "Filter projects by status",
                            },
                        },
                    },
                },
            ],
        };
    });
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            if (name === "get_user_profile") {
                const user = await user_model_1.default.findOne();
                if (!user) {
                    return {
                        content: [{ type: "text", text: "No user profile found in the database." }],
                        isError: true,
                    };
                }
                return {
                    content: [{ type: "text", text: JSON.stringify(user, null, 2) }],
                };
            }
            if (name === "get_projects") {
                const query = {};
                if (args?.status) {
                    query.status = args.status;
                }
                const projects = await project_model_1.default.find(query);
                return {
                    content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
                };
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
;
