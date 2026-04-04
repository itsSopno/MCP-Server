import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import User from "../Model/UserDetails.Model/user.model";
import Project from "../Model/ProjectDetails/project.model";

export const server = new Server(
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

server.setRequestHandler(ListToolsRequestSchema, async () => {
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

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_user_profile") {
      const user = await User.findOne();
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
      const query: any = {};
      if (args?.status) {
        query.status = args.status;
      }
      const projects = await Project.find(query);
      return {
        content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});
