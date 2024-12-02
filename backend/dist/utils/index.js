"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatIssues = formatIssues;
exports.processRow = processRow;
const data_schema_1 = require("../models/data.schema");
const data_1 = require("../data");
// Función para formatear issues de zod
function formatIssues(errors) {
    const errorList = errors.map((error) => [error.path, error.message]);
    return Object.fromEntries(errorList);
}
// Función para procesar cada fila
async function processRow(data) {
    const validation = data_schema_1.dataSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            result: {
                data,
                issues: formatIssues(validation.error.issues),
            },
        };
    }
    const userExists = await data_1.UserData.verifyData({ email: data.email });
    if (userExists) {
        return {
            success: false,
            result: {
                data,
                issues: formatIssues([
                    {
                        code: "invalid_type",
                        expected: "number",
                        received: "string",
                        path: ["email"],
                        message: "Correo ya registrado",
                    },
                ]),
            },
        };
    }
    return { success: true, result: { data: validation.data } };
}
