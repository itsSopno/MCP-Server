"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testGemini = exports.geminiModel = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API;
if (!apiKey) {
    console.error("GEMINI_API is not defined in environment variables");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey || "");
exports.geminiModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
const testGemini = async () => {
    try {
        console.log("Testing Gemini API connection...");
        const result = await exports.geminiModel.generateContent("Hello, how are you?");
        const text = result.response.text();
        console.log("Gemini Response:", text);
    }
    catch (err) {
        console.error("Gemini Test Error:", err.message || err);
    }
};
exports.testGemini = testGemini;
