/**
 * McpTool ইন্টারফেসটি ব্যবহার করা হয় যাতে প্রতিটি টুল একটি নির্দিষ্ট নিয়ম মেনে তৈরি করা হয়।
 */
export interface McpTool {
  name: string;          
  description: string;  
  inputSchema: {         
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
  handler: (args: any) => Promise<any>; 
}
