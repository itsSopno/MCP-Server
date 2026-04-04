"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gemini_controller_1 = require("../Controllers/gemini.controller");
const router = (0, express_1.Router)();
router.post("/chat", gemini_controller_1.chatWithGemini);
exports.default = router;
