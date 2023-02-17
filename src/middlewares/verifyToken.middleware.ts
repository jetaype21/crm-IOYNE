import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

// crear palabra secreta
const secret = process.env.SECRET_KEY || "DEV_TAYPE_KEY";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // comprobar cabecera de peticion x-access-token
  let token: any = req?.headers["x-access-token"];

  // comprobar si viene el token o no
  if (!token) {
    return res.status(500).send({
      code_status: 500,
      error: "Acceso denegado por TAYPE21 🚫🚫",
    });
  }

  // verificar el token para ver si es valido
  token.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      return res.status(500).send({
        code_status: 500,
        error: "Token invalido 🚫🚫",
      });
    }
  });

  // * si logra superar todas las pruebas dejamos pasar
  next();
};
