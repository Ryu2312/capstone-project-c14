"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = AuthService;
exports.CsvService = CsvService;
const data_1 = require("../data");
const error_handler_1 = require("../middleware/error-handler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const login_schema_1 = require("../models/login.schema");
const validation_data_1 = require("../middleware/validation-data");
const zod_1 = require("zod");
const promises_1 = __importDefault(require("fs/promises"));
const papaparse_1 = __importDefault(require("papaparse"));
async function AuthService(email, password) {
    //comprobamos que exista el usuario
    const user = await data_1.UserData.verifyData({ email });
    if (!user) {
        throw new error_handler_1.ApiError("Credenciales Incorrectas", 401);
    }
    //verificamos su password
    const isvalid = await bcrypt_1.default.compare(password, user.password);
    if (!isvalid) {
        throw new error_handler_1.ApiError("Credenciales Incorrectas", 401);
    }
    return user;
}
async function CsvService(file) {
    if (!file) {
        throw new Error("No se envió un archivo");
    }
    const fileCount = {
        succesfully: 0,
        failed: [],
    };
    try {
        const data = await promises_1.default.readFile(file.path, "utf-8");
        // Parsear el archivo CSV
        const csvFile = [];
        papaparse_1.default.parse(data, {
            skipEmptyLines: true,
            dynamicTyping: true,
            header: true,
            complete: (results) => {
                csvFile.push(...results.data);
            }
        });
        for (const [index, line] of csvFile.entries()) {
            const user = await data_1.UserData.verifyData({ email: line.email });
            if (user) {
                fileCount.failed.push({
                    row: index + 1,
                    data: line,
                    message: "Email ya registrado",
                });
                continue;
            }
            try {
                const validatedData = login_schema_1.dataRegister.parse(line);
                const hashedPassword = await bcrypt_1.default.hash(validatedData.password, 10);
                const rowCount = await data_1.UserData.insertData({ ...validatedData, password: hashedPassword });
                fileCount.succesfully += rowCount;
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    fileCount.failed.push({
                        row: index + 1,
                        data: line,
                        message: (0, validation_data_1.formatIssues)(error.issues),
                    });
                }
                else {
                    fileCount.failed.push({
                        row: index + 1,
                        data: line,
                        message: "Error inesperado",
                    });
                }
            }
        }
        await promises_1.default.unlink(file.path);
    }
    catch (error) {
        throw new error_handler_1.ApiError("Error al procesar el archivo CSV", 500);
    }
    return fileCount;
}
