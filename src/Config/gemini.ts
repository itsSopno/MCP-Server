import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API;

if (!apiKey) {
    console.error("❌ GEMINI_API is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

export const testGemini = async () => {
    try {
        console.log("Testing Gemini API connection...");
        const result = await geminiModel.generateContent("Hello, how are you?");
        const text = result.response.text();
        console.log("✅ Gemini Response:", text);
    } catch (err: any) {
        console.error("❌ Gemini Test Error:", err.message || err);
    }
};
