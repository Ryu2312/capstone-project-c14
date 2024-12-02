"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (req, res, next) => {
    try {
        res.status(404).json({
            message: "Not Found",
            path: req.originalUrl,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.notFoundHandler = notFoundHandler;
