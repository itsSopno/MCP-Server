import { Router } from "express";
import { chatWithGemini } from "../Controllers/gemini.controller";

const router = Router();

router.post("/chat", chatWithGemini);

export default router;
