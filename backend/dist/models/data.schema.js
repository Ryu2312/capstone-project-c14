"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.dataSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// Esquema de validación para los datos generales
exports.dataSchema = zod_1.default.object({
    id: zod_1.default.number().optional(),
    name: zod_1.default
        .string({
        required_error: "name es requerido.",
        invalid_type_error: "name debe ser un string.",
    })
        .min(1, "El contenido no puede estar vacío"),
    password: zod_1.default
        .string().optional().default("123456"),
    email: zod_1.default
        .string({
        required_error: "email es requerido.",
        invalid_type_error: "Debe ingresar un email valido",
    })
        .email()
        .min(1, "El contenido no puede estar vacío"),
    age: zod_1.default
        .number()
        .optional()
        .refine((age) => age === null || age === undefined || age > 0, {
        message: "La edad debe ser mayor a 0 si se proporciona.",
    })
        .nullable(),
    role: zod_1.default.enum(["user", "admin"]).optional().default("user"),
});
// Tipo para la validación de datos de login (solo email y password)
exports.loginSchema = exports.dataSchema.pick({
    email: true,
    password: true,
});
