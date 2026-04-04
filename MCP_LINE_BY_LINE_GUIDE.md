# MCP Server Line-by-Line Documentation (Bengali)

এই গাইডে আপনার এমসিপি সার্ভারের প্রতিটি গুরুত্বপূর্ণ ফাইলের কোড বিস্তারিতভাবে ব্যাখ্যা করা হয়েছে।

---

## ১. `src/mcp/server.ts` (Core Logic)
এটি সার্ভারের মস্তিষ্ক। এখানে আমরা টুলস এবং রিসোর্স ডিফাইন করি।

```typescript
// ১. প্রয়োজনীয় মডিউল ইমপোর্ট করা
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import User from "../Model/UserDetails.Model/user.model";

// ২. একটি নতুন এমসিপি সার্ভার ইনস্ট্যান্স তৈরি করা
export const server = new Server(
  { name: "portfolio-server", version: "1.0.0" },
  { capabilities: { tools: {} } } // আমরা বলছি এই সার্ভারে 'tools' আছে
);

// ৩. এআই-কে টুলস এর লিস্ট পাঠানো
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_user_profile", // টুলের নাম
        description: "ব্যবহারকারীর তথ্য জানার জন্য", // এআই যাতে বুঝতে পারে এটি কেন
        inputSchema: { type: "object", properties: {} } // ইনপুট হিসেবে কী কী লাগবে (এক্ষেত্রে কিছু না)
      }
    ]
  };
});

// ৪. যখন এআই কোনো টুল কল করবে, তখন কী হবে
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;
  if (name === "get_user_profile") {
    const user = await User.findOne(); // ডাটাবেস থেকে ইউজার খুঁজে আনা
    return {
      content: [{ type: "text", text: JSON.stringify(user) }] // ফলাফল এআই-কে টেক্সট হিসেবে পাঠানো
    };
  }
});
```

---

## ২. `src/mcp/stdio.ts` (Local Connection)
এটি লোকাল আইডির (যেমন Cursor) সাথে কথা বলার জন্য ব্যবহৃত হয়।

```typescript
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server";
import connectDB from "../Config/database";

// ১. ডাটাবেস কানেক্ট করা এবং স্টুডিও ট্রান্সপোর্ট চালু করা
async function main() {
  await connectDB(); // MongoDB কানেক্ট করা
  const transport = new StdioServerTransport(); // স্টুডিও ট্রান্সপোর্ট তৈরি
  await server.connect(transport); // সার্ভারের সাথে ট্রান্সপোর্ট যুক্ত করা
}

main(); // ফাংশনটি কল করা
```

---

## ৩. `src/index.ts` (Web Connection-SSE)
এখানে আপনার পোর্টফোলিও ওয়েবসাইট কানেক্ট করার জন্য এক্সপ্রেস রাউট তৈরি করা হয়েছে।

```typescript
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { server } from "./mcp/server";

// ১. মাল্টিপল সেশন হ্যান্ডেল করার জন্য একটি ম্যাপ তৈরি
const mcpTransports = new Map<string, SSEServerTransport>();

// ২. গেট রাউট (কানেকশন ওপেন করার জন্য)
app.get("/mcp", async (req, res) => {
    // একটি নতুন এসএসই ট্রান্সপোর্ট তৈরি
    const transport = new SSEServerTransport("/messages", res); 
    const sessionId = transport.sessionId; // সেশন আইডি রাখা কাজ শেষ হলে ডিলিট করার জন্য
    mcpTransports.set(sessionId, transport);
    
    // এমসিপি সার্ভারকে এই ট্রান্সপোর্টের সাথে কানেক্ট করা
    await server.connect(transport);

    // কানেকশন বন্ধ হলে ম্যাপ থেকে মুছে ফেলা
    res.on("close", () => mcpTransports.delete(sessionId));
});

// ৩. পোস্ট রাউট (মেসেজ রিসিভ করার জন্য)
app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string; // কুয়েরি থেকে আইডি নেওয়া
    const transport = mcpTransports.get(sessionId); // ম্যাপ থেকে ট্রান্সপোর্ট খুঁজে বের করা
    
    if (transport) {
        await transport.handlePostMessage(req, res); // মেসেজ হ্যান্ডেল করা
    }
});
```

---

## গুরুত্বপূর্ণ নোট:
- **`stdio`**: এটি একটি টানেলের মতো কাজ করে আপনার পিসির এবং এআই-এর মাঝে।
- **`SSE`**: এটি ইন্টারনেটের মাধ্যমে ডেটা পাঠানোর একটি নিরবচ্ছিন্ন পদ্ধতি।
- **`tools`**: এআই যখন নিজে থেকে কোনো কাজ করতে চায় (যেমন ডাটাবেস চেক), তখন সে এই টুলগুলো ব্যবহার করে।
