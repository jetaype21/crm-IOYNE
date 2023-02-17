import { IUser, IAuth } from "../../domain/interfaces/IAuth.interface";

export interface IAuthController {
  createUser(user: IUser): Promise<any>;
  loginUser(auth: IAuth): Promise<any>;
}
