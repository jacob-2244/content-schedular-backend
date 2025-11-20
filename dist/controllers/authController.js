"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user already exists
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }
        // Hash password
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            email,
            password: hashed
        });
        return res.json({ message: "User registered", userId: user._id });
    }
    catch (error) {
        return res.status(500).json({ message: "Register error", error });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid email" });
        // Compare password
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid password" });
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email }
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Login error", error });
    }
};
exports.login = login;
