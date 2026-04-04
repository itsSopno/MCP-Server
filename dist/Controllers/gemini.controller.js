"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithGemini = void 0;
const gemini_1 = require("../Config/gemini");
// @desc  Generate AI response
// @route POST /api/ai/chat
const chatWithGemini = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            res.status(400).json({ message: "Prompt is required" });
            return;
        }
        const result = await gemini_1.geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ response: text });
    }
    catch (error) {
        console.error("❌ Gemini Error:", error.message || error);
        res.status(500).json({
            message: "Failed to generate AI response",
            error: error.message || "Unknown error"
        });
    }
};
exports.chatWithGemini = chatWithGemini;
