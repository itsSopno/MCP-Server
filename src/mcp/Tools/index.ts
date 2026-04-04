import { getUserProfile } from "./getUserProfile";
import { getProjects } from "./getProjects";
import { McpTool } from "./types";
import { githubProjectDetails } from "./githubProjectDetails";

/**
 * সকল টুলগুলোর একটি মোট লিস্ট যা পরবর্তীতে server.ts এ ব্যবহার করা হবে।
 */
export const tools: McpTool[] = [
  getUserProfile,
  getProjects,
  githubProjectDetails
];
