"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateHandler = authenticateHandler;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_handler_1 = require("./error-handler");
function authenticateHandler(req, _res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return next(new error_handler_1.ApiError("No autorizado", 401));
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWTSECRETKEY);
        req.id = payload.id;
        req.username = payload.username;
        next();
    }
    catch (error) {
        return next(new error_handler_1.ApiError("No autorizado", 401));
    }
}
