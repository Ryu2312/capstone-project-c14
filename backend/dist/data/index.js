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
            return (await (0, db_1.query)('INSERT INTO users (name, email, password, age, role) VALUES ($1, $2, $3, $4, $5)', [data.name, data.email, data.password, data.age, data.role])).rowCount ?? 0;
        }
        return (await (0, db_1.query)('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [data.name, data.email, data.password, data.role])).rowCount ?? 0;
    }
}
exports.UserData = UserData;
