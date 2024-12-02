import { ZodIssue } from "zod";
import { DataFromDb, dataSchema, Result } from "../models/data.schema";
import { UserData } from "../data";

// Función para formatear issues de zod
export function formatIssues(errors: ZodIssue[]) {
  const errorList = errors.map((error) => [error.path, error.message]);
  return Object.fromEntries(errorList);
}

// Función para procesar cada fila
export async function processRow(data: DataFromDb): Promise<{ success: boolean; result:Result }> {
  const validation = dataSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      result: {
        data,
        issues: formatIssues(validation.error.issues),
      },
    };
  }

  const userExists = await UserData.verifyData({ email: data.email });
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
  
  return { success: true, result: { data:validation.data } };
}
