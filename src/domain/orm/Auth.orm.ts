import { IUser, IAuth } from "../interfaces/IAuth.interface";
import pool from "../../db";
import { LogError } from "../../utils/logger";
import { userFindByEmail } from "./User.orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerNewUser = async (user: IUser) => {
  try {
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_lastname, user_email, user_password, rol_id, user_is_admin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        user.name,
        user.lastname,
        user.email,
        user.password,
        user.rol_id,
        user.is_admin,
      ]
    );

    return {
      user: newUser.rows[0],
    };
  } catch (error) {
    LogError(`[error AUTH ORM]: ${error}`);
    return {
      error: `se produjo un error ${error}`,
    };
  }
};

export const loginUser = async (auth: IAuth) => {
  try {
    let token = undefined;
    let userResult = await userFindByEmail(auth.email);

    const { user_password, user_id } = userResult.user;

    let validPassword = await bcrypt.compare(auth.password, user_password);

    if (!validPassword) {
      await pool.query(
        "UPDATE users SET user_last_intent = current_timestamp, user_check = $1 WHERE user_id = $2 RETURNING *",
        [false, user_id]
      );

      throw new Error("Invalid password");
    }

    await pool.query(
      "UPDATE users SET user_last_intent = current_timestamp, user_check = $1 WHERE user_id = $2 RETURNING *",
      [true, user_id]
    );

    token = jwt.sign(
      {
        email: userResult.user.user_email,
      },
      process.env.SECRET_KEY || "DEV_TAYPE_KEY",
      {
        expiresIn: "2h",
      }
    );

    return {
      code_status: 200,
      user: userResult.user,
      token,
    };
  } catch (error) {
    if (error) {
      return {
        code_status: 404,
        error: `${error}`,
      };
    }

    return {
      code_status: 404,
      error: "Las contraseñas no coinciden",
    };
  }
};
