"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
exports.default = errorHandler;
class ApiError extends Error {
    constructor(message, status, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}
exports.ApiError = ApiError;
function errorHandler(error, _req, res, _next) {
    console.log(`Error handler!`);
    if (error instanceof ApiError) {
        res.status(error.status).json({
            ok: false,
            error: {
                message: error.message,
                details: error.details,
            },
        });
    }
    else {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: {
                message: "Error interno del servidor",
            },
        });
    }
}
