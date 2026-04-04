import { McpTool } from "./types";

/**
 * @name get_github_project_details
 * @desc GitHub থেকে ল্যাঙ্গুয়েজ স্ট্যাটস এবং README ফেচ করার জন্য।
 */
export const githubProjectDetails: McpTool = {
  name: "get_github_project_details",
  description: "GitHub-এর যেকোনো রিপোজিটরি থেকে ল্যাঙ্গুয়েজ পার্সেন্টেজ এবং README কন্টেন্ট পাওয়ার জন্য।",
  inputSchema: {
    type: "object",
    properties: {
      owner: { type: "string", description: "GitHub ইউজার নাম" },
      repo: { type: "string", description: "রিপোজিটরির নাম" },
    },
    required: ["owner", "repo"],
  },

  handler: async (args: { owner: string; repo: string }) => {
    const { owner, repo } = args;
    const token = process.env.GITHUB_TOKEN;

    const headers: Record<string, string> = {
      "accept": "application/vnd.github.v3+json",
      "User-Agent": "MCP-Portfolio-Server",
    };

    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    try {
      const langResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
      
      if (!langResponse.ok) {
        throw new Error(`Repository not found or access denied. Status: ${langResponse.status}`);
      }

      const languages = await langResponse.json() as Record<string, number>;

      const totalBytes = Object.values(languages).reduce((sum, val) => sum + val, 0);
      const languagesList = Object.entries(languages).map(([lang, bytes]) => ({
        language: lang,
        percentage: ((bytes / totalBytes) * 100).toFixed(1) + "%",
      }));

      const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
      
      let readmeContent = "README not found.";
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json() as { content?: string };
        if (readmeData.content) {
          readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8");
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              repo: `${owner}/${repo}`,
              url: `https://github.com/${owner}/${repo}`,
              languages: languagesList,
              readme: readmeContent,
            }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error fetching data: ${error.message}` }],
        isError: true,
      };
    }
  },
};
