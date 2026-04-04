import Project from "../../Model/ProjectDetails/project.model";
import { McpTool } from "./types";

/**
 * @name get_projects tool
 * @desc প্রোজেক্টের লিস্ট পাওয়ার জন্য।
 */
export const getProjects: McpTool = {
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

  handler: async (args: any) => {
    const query: any = {};
    if (args?.status) {
      query.status = args.status;
    }
    const projects = await Project.find(query);
    return {
      content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
    };
  },
};
