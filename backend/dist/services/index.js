"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = authService;
exports.registerService = registerService;
const data_1 = require("../data");
const error_handler_1 = require("../middleware/error-handler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utils");
//Función para loguearse
async function authService(email, password) {
    //comprobamos que exista el usuario
    const user = await data_1.UserData.verifyData({ email });
    if (!user) {
        throw new error_handler_1.ApiError("Email Incorrecto", 401);
    }
    //verificamos su password
    const isvalid = await bcrypt_1.default.compare(password, user.password);
    if (!isvalid) {
        throw new error_handler_1.ApiError("Password Incorrecto", 401);
    }
    return user;
}
//Función para registrar archivos.csv
async function registerService(chunk) {
    const { row, data } = chunk;
    try {
        const { success, result } = await (0, utils_1.processRow)(data);
        if (!success) {
            console.log(result.issues);
            return {
                success,
                result: {
                    ...result,
                    row
                }
            };
        }
        const hashedPassword = await bcrypt_1.default.hash(result.data.password, 10);
        await data_1.UserData.insertData({ ...result.data, password: hashedPassword });
        console.log();
        return {
            success,
            result: {
                row,
                data
            }
        };
    }
    catch (error) {
        return {
            success: false,
            result: {
                row,
                data,
                issues: (0, utils_1.formatIssues)([
                    {
                        code: "invalid_literal",
                        expected: "null",
                        received: "null",
                        path: ["desconocido"],
                        message: "Error desconocido al procesar esta fila:" + error,
                    },
                ]),
            },
        };
    }
}
