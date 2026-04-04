import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

async function test() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["ts-node", path.resolve(__dirname, "stdio.ts")],
  });

  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );

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
