"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
exports.app = (0, express_1.default)();
const _dirName = path_1.default.join(path_1.default.resolve(), '..', 'frontend', 'dist');
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.static(_dirName));
exports.app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(_dirName, 'index.html'));
});
