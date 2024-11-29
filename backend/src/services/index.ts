import { UsersData } from "../data";
import { ApiError } from "../middleware/error-handler";
const bcrypt = require("bcrypt");

export default class usersService {

  static async login(email: string, password: string) {
    //comprobamos que exista el usuario
    const user = await UsersData.verifyData({ email });
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
}
