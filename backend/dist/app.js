"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const not_found_1 = require("./middleware/not-found");
exports.app = (0, express_1.default)();
const _dirName = path_1.default.join(path_1.default.resolve(), '..', 'frontend', 'dist');
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.static(_dirName));
exports.app.use(routes_1.router);
exports.app.use(not_found_1.notFoundHandler);
exports.app.use(error_handler_1.default);
