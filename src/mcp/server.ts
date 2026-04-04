import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import User from "../Model/ProjectDetails/project.model";
import { tools } from "./Tools"; // modular tools ইম্পোর্ট করা হলো

export function createMcpServer() {
  const server = new Server(
    {
      name: "portfolio-knowledge-base",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
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

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === "user://profile") {
      const user = await User.findOne();
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
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // অটোমেটিক সঠিক টুলটির হেন্ডলার কল করার জন্য
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const tool = tools.find((t) => t.name === name);
      if (tool) {
        return await tool.handler(args);
      }

      throw new Error(`Tool not found: ${name}`);
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  });

  return server;
}
