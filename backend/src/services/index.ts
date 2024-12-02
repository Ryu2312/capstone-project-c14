import { UserData  } from "../data";
import { ApiError } from "../middleware/error-handler";
import bcrypt from "bcrypt";
import {  Result } from "../models/data.schema";
import {  formatIssues, processRow } from "../utils";

  //Función para loguearse
  export async function authService(email: string, password: string) {
    //comprobamos que exista el usuario
    const user = await UserData.verifyData({ email });
    if (!user) {
      throw new ApiError("Email Incorrecto", 401);
    }
    //verificamos su password
    const isvalid = await bcrypt.compare(password, user.password);
    if (!isvalid) {
      throw new ApiError("Password Incorrecto", 401);
    }

    return user;
  }

  //Función para registrar archivos.csv
export async function registerService(chunk: Result) :Promise<{ success: boolean; result: Result }>  {
    const { row, data} = chunk;
    
try {
    const {success, result} = await processRow(data);
    if (!success) {
      console.log(result.issues)
      return {
        success,
        result: {
          ...result, 
          row
        }
      };
    }
    
    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    await UserData.insertData({ ...result.data, password: hashedPassword });
    console.log()
    return { 
      success, 
      result: {
        row,
        data
      } 
    };

  } catch (error) {
    return {
       success: false,
      result: {
        row,
        data,
        issues: formatIssues([
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

