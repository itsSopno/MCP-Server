"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../Model/UserDetails.Model/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// @desc  Register a new user
// @route POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await user_model_1.default.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", userId: user._id });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.registerUser = registerUser;
// @desc  Login user
// @route POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.loginUser = loginUser;
