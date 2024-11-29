import z from "zod";

export const dataSchema = z.object({
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
        .email(),
    age: z.number().optional(),
    role: z.enum(["user", "admin"]).optional().default("user"),
});

export const loginSchema = dataSchema.pick({
  email: true,
  password: true,
});