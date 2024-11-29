"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationHandler = validationHandler;
exports.formatIssues = formatIssues;
const zod_1 = require("zod");
const error_handler_1 = require("./error-handler");
function validationHandler(schema) {
    return async (req, _res, next) => {
        try {
            const body = schema.parse(req.body);
            req.body = body;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(new error_handler_1.ApiError("Error de validación", 400, formatIssues(error.issues)));
            }
            else {
                next(error);
            }
        }
    };
}
function formatIssues(errors) {
    const errorList = errors.map((error) => [error.path, error.message]);
    return Object.fromEntries(errorList);
}
