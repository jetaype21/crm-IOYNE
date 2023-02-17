import { IUser } from "src/domain/interfaces/IAuth.interface";
import { IAuthController } from "./interfaces";
import { LogWarning, LogInfo } from "../utils/logger";
import { registerNewUser, loginUser } from "../domain/orm/Auth.orm";
import { userFindByEmail } from "../domain/orm/User.orm";
import { IAuth } from "../domain/interfaces/IAuth.interface";
import bcrypt from "bcrypt";

export class AuthController implements IAuthController {
  public async createUser(user: IUser): Promise<any> {
    let response: any = "";

    if (user) {
      // buscando si exste el usuario con el mismo correo
      const userFind = await userFindByEmail(`${user.email}`);
      LogInfo(`${userFind}`);

      if (userFind.user) {
        return {
          code_status: 404,
          error: `ya existe el usuario con correo ${user.email}`,
        };
      }

      LogInfo(`Creando nuevo usuario: ${user.name}`);
      await registerNewUser(user)
        .then((res) => {
          response = {
            code_status: 200,
            user: res?.user,
          };
        })
        .catch((error) => {
          response = {
            code_status: 404,
            error: error.error,
          };
        });
    } else {
      LogWarning("[AuthController]: error al crear usuario");
      response = {
        code_status: 500,
        error: `Nesecita un objeto para crear`,
      };
    }

    return response;
  }

  public async loginUser(auth: IAuth): Promise<any> {
    let response: any;

    if (auth) {
      const userFound = await userFindByEmail(auth.email);
      if (!userFound.user) {
        return {
          code_status: 404,
          error: `No se encontro el usuario con correo: ${auth.email}`,
        };
      }

      const data = await loginUser(auth);

      if (data.user) {
        return {
          code_status: data.code_status,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          code_status: data.code_status,
          error: data.error,
        };
      }
    } else {
      LogWarning("[LOGIN CONTROLLER]: nesecitas brindrar un objeto");
      response = {
        code_status: 404,
        error: `Por favor brindar correo y contraseña`,
      };
    }

    return response;
  }
}
