import { UserData  } from "../data";
import { ApiError } from "../middleware/error-handler";
import bcrypt from "bcrypt";
import { dataRegister, DataRegister, ImportResult } from "../models/data.schema";
import { formatIssues } from "../utils";
import { ZodError } from "zod";
import fs from "fs/promises";
import Papa from "papaparse";


  export async function AuthService(email: string, password: string) {
    //comprobamos que exista el usuario
    const user = await UserData .verifyData({ email });
    if (!user) {
      throw new ApiError("Credenciales Incorrectas", 401);
    }

    //verificamos su password
    const isvalid = await bcrypt.compare(password, user.password);
    if (!isvalid) {
      throw new ApiError("Credenciales Incorrectas", 401);
    }

    return user;
  }

  export async function CsvService(file: Express.Multer.File | undefined) {
  if (!file) {
    throw new Error("No se envió un archivo");
  }

  const fileCount: ImportResult = {
    success: 0,
    failed: [],
  };

  try {
    const data = await fs.readFile(file.path, "utf-8");

    // Parsear el archivo CSV
    const csvFile: DataRegister[] = [];
    Papa.parse(data, {
       skipEmptyLines: true,
        dynamicTyping: true,
        header: true,
        complete: (results) => {
            csvFile.push(...results.data as DataRegister[]);
        }
    });

    for (const [index, row] of csvFile.entries()) {
        try {
          // Validar fila usando Zod
          const validData = dataRegister.parse(row);

          // Verificar si el usuario ya existe
          const userExists = await UserData.verifyData({ email: validData.email });

          if (userExists) {
            fileCount.failed.push({
              row: index + 1,
              data: row,
              issues: "Email ya registrado",
            });
            continue;
          }

          // Hashear contraseña
          const hashedPassword = await bcrypt.hash(validData.password, 10);

          // Guardar datos en la base de datos
          const result = await UserData.insertData({ ...validData, password: hashedPassword });
          
          //result es el número de filas afectadas puede ser 1 o 0;
          fileCount.success += result;
        } catch (error) {
          if (error instanceof ZodError) {
            // Capturar errores de validación
            fileCount.failed.push({
              row: index + 1,
              data: row,
              issues: formatIssues(error.issues),
            });
          } else {
            // Capturar otros errores
            fileCount.failed.push({
              row: index + 1,
              data: row,
              issues: "Error desconocido al procesar esta fila." ,
            });
          }
        }
      }
    //Borrar el archivo csv
    await fs.unlink(file.path);

  } catch (error) {
    throw new ApiError("Error al procesar el archivo CSV", 500);
  }

  return fileCount;
}

