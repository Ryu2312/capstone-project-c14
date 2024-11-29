import { UserData  } from "../data";
import { ApiError } from "../middleware/error-handler";
import bcrypt from "bcrypt";
import { dataRegister, DataRegister } from "../models/data.schema";
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

  const fileCount: { 
    succesfully: number; 
    failed: { row: number; data: DataRegister; message: string }[]; 
  } = {
    succesfully: 0,
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

    for (const [index, line] of csvFile.entries()) {
      const user = await UserData .verifyData({ email: line.email });

      if (user) {
        fileCount.failed.push({
          row: index + 1,
          data: line,
          message: "Email ya registrado",
        });
        continue;
      }

      try {
        const validatedData = dataRegister.parse(line);
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const rowCount = await UserData .insertData({ ...validatedData, password: hashedPassword });
        fileCount.succesfully += rowCount;
      } catch (error) {
        if (error instanceof ZodError) {
          fileCount.failed.push({
            row: index + 1,
            data: line,
            message: formatIssues(error.issues),
          });
        } else {
          fileCount.failed.push({
            row: index + 1,
            data: line,
            message: "Error inesperado",
          });
        }
      }
    }

    await fs.unlink(file.path);
  } catch (error) {
    throw new ApiError("Error al procesar el archivo CSV", 500);
  }

  return fileCount;
}

