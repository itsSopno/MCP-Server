import { Request, Response } from "express";
import { geminiModel } from "../Config/gemini";

// @desc  Generate AI response
// @route POST /api/ai/chat
export const chatWithGemini = async (req: Request, res: Response): Promise<void> => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            res.status(400).json({ message: "Prompt is required" });
            return;
        }

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error: any) {
        console.error("❌ Gemini Error:", error.message || error);
        res.status(500).json({ 
            message: "Failed to generate AI response", 
            error: error.message || "Unknown error" 
        });
    }
};
