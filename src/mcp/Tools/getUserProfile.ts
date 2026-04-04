import User from "../../Model/UserDetails.Model/user.model";
import { type McpTool } from "./types";

/**
 * @name get_user_profile tool
 * @desc ব্যবহারকারীর বিস্তারিত প্রোফাইল তথ্য পাওয়ার জন্য।
 */
export const getUserProfile: McpTool = {
  name: "get_user_profile",
  description: "for user all details",
  inputSchema: {
    type: "object",
    properties: {},
  },

  handler: async () => {
    const user = await User.findOne();
    if (!user) {
      return {
        content: [{ type: "text", text: "User profile not found in database." }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(user, null, 2) }],
    };
  },
};