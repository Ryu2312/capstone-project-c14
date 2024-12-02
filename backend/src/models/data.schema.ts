import z from "zod";

// Esquema de validación para los datos generales
export const dataSchema = z.object({
    id: z.number().optional(),
    name: z
        .string({
            required_error: "name es requerido.",
            invalid_type_error: "name debe ser un string.",
        })
        .min(1, "El contenido no puede estar vacío"),
    password: z
        .string().optional().default("123456"),
    email: z
        .string({
            required_error: "email es requerido.",
            invalid_type_error: "Debe ingresar un email valido",
        })
        .email()
        .min(1, "El contenido no puede estar vacío"),
    age: z
        .number()
        .optional()
        .refine((age) => age === null || age === undefined || age > 0, {
            message: "La edad debe ser mayor a 0 si se proporciona.",
        })
        .nullable(),
    role: z.enum(["user", "admin"]).optional().default("user"),
});

export type DataFromDb = z.infer<typeof dataSchema>;


// Tipo para la validación de datos de login (solo email y password)
export const loginSchema = dataSchema.pick({
  email: true,
  password: true,
});

export type Login = z.infer<typeof loginSchema>;

export interface Result {
  row?: number;
  data: DataFromDb;
  issues?: IssuesData[] | string;
}

export interface IssuesData {
  name?: string;
  email?: string;
  age?: string;
}