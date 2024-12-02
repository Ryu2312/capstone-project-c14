"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const services_1 = require("../services");
const path_1 = __importDefault(require("path"));
const data_schema_1 = require("../models/data.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate_1 = require("../middleware/authenticate");
const busboy_1 = __importDefault(require("busboy"));
const papaparse_1 = __importDefault(require("papaparse"));
exports.router = (0, express_1.Router)();
exports.router.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'index.html'));
});
exports.router.post("/signup", async (req, res, next) => {
    try {
        const result = await (0, services_1.registerService)({ data: req.body, row: 1 });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = data_schema_1.loginSchema.parse(req.body);
        const user = await (0, services_1.authService)(email, password);
        const payload = {
            id: user.id,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWTSECRETKEY, {
            expiresIn: "40000m",
        });
        res.status(200).json({
            ok: true,
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.router.post("/upload", async (req, res, next) => {
    const busboy = (0, busboy_1.default)({ headers: req.headers });
    const processingPromises = [];
    let index = 0;
    busboy.on('file', (fieldname, file, info) => {
        console.log(fieldname, info);
        const papaStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, {
            skipEmptyLines: true,
            dynamicTyping: true,
            header: true,
        });
        file.pipe(papaStream);
        papaStream.on('data', (chunk) => {
            processingPromises.push((0, services_1.registerService)({ data: chunk, row: index++ }));
        });
        papaStream.on('end', async () => {
            try {
                // Esperamos que todas las promesas se resuelvan
                const result = await Promise.all(processingPromises);
                const success = result.filter((item) => item.success).length;
                const failed = result.filter((item) => !item.success);
                res.status(201).json({ ok: true, success, failed });
            }
            catch (error) {
                next(error); // Manejamos cualquier error que ocurra durante el procesamiento
            }
        });
        papaStream.on('error', (error) => {
            next(error);
        });
    });
    req.pipe(busboy);
});
exports.router.post("/register", authenticate_1.authenticateHandler, async (req, res, next) => {
    try {
        const result = await (0, services_1.registerService)(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
