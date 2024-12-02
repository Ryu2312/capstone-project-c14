"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = void 0;
const db_1 = require("../db");
class UserData {
    static async verifyData({ email }) {
        return (await (0, db_1.query)('SELECT * FROM users WHERE email = $1', [email])).rows[0];
    }
    static async insertData(data) {
        if (data.age) {
            return (await (0, db_1.query)('INSERT INTO users (name, email, password, age, role) VALUES ($1, $2, $3, $4, $5) RETURNING name, email,age', [data.name, data.email, data.password, data.age, data.role])).rows[0];
        }
        return (await (0, db_1.query)('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING name, email', [data.name, data.email, data.password, data.role])).rows[0];
    }
}
exports.UserData = UserData;
