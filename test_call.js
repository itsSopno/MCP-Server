const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const path = require("path");

async function main() {
    try {
        const transport = new StdioClientTransport({
            command: "node",
            args: [path.join(process.cwd(), "dist/mcp/stdio.js")],
        });

        const client = new Client(
            { name: "test-client", version: "1.0.0" },
            { capabilities: {} }
        );

        await client.connect(transport);
        
        console.error("Calling get_user_profile...");
        const result = await client.callTool({
            name: "get_user_profile",
            arguments: {},
        });

        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Error calling tool:", error);
        process.exit(1);
    }
}

main();
