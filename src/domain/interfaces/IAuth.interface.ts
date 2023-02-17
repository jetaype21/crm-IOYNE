export interface IUser {
  name: string;
  lastname: string;
  email: string;
  password: string;
  is_admin: boolean;
  rol_id: number;
}
export interface IAuth {
  email: string;
  password: string;
}
