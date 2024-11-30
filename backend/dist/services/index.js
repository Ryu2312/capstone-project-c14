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
const data_schema_1 = require("../models/data.schema");
const utils_1 = require("../utils");
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
        success: 0,
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
        for (const [index, row] of csvFile.entries()) {
            try {
                // Validar fila usando Zod
                const validData = data_schema_1.dataRegister.parse(row);
                // Verificar si el usuario ya existe
                const userExists = await data_1.UserData.verifyData({ email: validData.email });
                if (userExists) {
                    fileCount.failed.push({
                        row: index + 1,
                        data: row,
                        issues: "Email ya registrado",
                    });
                    continue;
                }
                // Hashear contraseña
                const hashedPassword = await bcrypt_1.default.hash(validData.password, 10);
                // Guardar datos en la base de datos
                const result = await data_1.UserData.insertData({ ...validData, password: hashedPassword });
                //result es el número de filas afectadas puede ser 1 o 0;
                fileCount.success += result;
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    // Capturar errores de validación
                    fileCount.failed.push({
                        row: index + 1,
                        data: row,
                        issues: (0, utils_1.formatIssues)(error.issues),
                    });
                }
                else {
                    // Capturar otros errores
                    fileCount.failed.push({
                        row: index + 1,
                        data: row,
                        issues: "Error desconocido al procesar esta fila.",
                    });
                }
            }
        }
        //Borrar el archivo csv
        await promises_1.default.unlink(file.path);
    }
    catch (error) {
        throw new error_handler_1.ApiError("Error al procesar el archivo CSV", 500);
    }
    return fileCount;
}
