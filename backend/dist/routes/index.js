"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const services_1 = require("../services");
const path_1 = __importDefault(require("path"));
const login_schema_1 = require("../models/login.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
exports.router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
exports.router.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'index.html'));
});
exports.router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = login_schema_1.loginSchema.parse(req.body);
        const user = await (0, services_1.AuthService)(email, password);
        const payload = {
            id: user.id,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWTSECRETKEY, {
            expiresIn: "40000m",
        });
        res.status(200).json({
            ok: true,
            data: token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.router.post("/upload", upload.single("file"), async (req, res, next) => {
    try {
        const result = await (0, services_1.CsvService)(req.file);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
