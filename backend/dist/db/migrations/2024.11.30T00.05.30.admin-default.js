"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const up = async (params) => {
    const name = "Alexis Lazo";
    const email = "alex23@gmail.com";
    const password = await bcrypt_1.default.hash("123456", 10);
    const age = 27;
    const role = "admin";
    await params.context.query(` 
      INSERT INTO users (name, email, age, role, password) 
      VALUES ($1, $2, $3, $4, $5)
    `, [name, email, age, role, password]);
};
exports.up = up;
const down = async (params) => {
    await params.context.query(`DELETE FROM users;`);
};
exports.down = down;
