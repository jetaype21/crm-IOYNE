import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

import bodyParser from "body-parser";
import { AuthController } from "../controller/AuthController";
import { IAuth } from "../domain/interfaces/IAuth.interface";
let jsonParser = bodyParser.json();
let authRouter = express.Router();

authRouter
  .route("/create-user")
  .post(jsonParser, async (req: Request, res: Response) => {
    let { name, lastname, email, password, rol_id } = req?.body;
    let hashedPassword = "";

    if (name && lastname && email && password && rol_id) {
      const saltRounds = 10;
      hashedPassword = bcrypt.hashSync(password, saltRounds);

      let newUser = {
        name,
        lastname,
        email,
        password: hashedPassword,
        is_admin: rol_id === 1 ? true : false,
        rol_id,
      };

      const controller: AuthController = new AuthController();
      const response: any = await controller.createUser(newUser);

      return res.status(response.code_status || 200).send(response);
    } else {
      return res.status(400).send({
        error: "no se pudo registrar",
      });
    }
  });

authRouter
  .route("/login-user")
  .post(jsonParser, async (req: Request, res: Response) => {
    let { email, password } = req.body;

    if (password && email) {
      let auth: IAuth = {
        email,
        password,
      };

      const controller: AuthController = new AuthController();

      const response: any = await controller.loginUser(auth);

      return res.status(response.code_status || 200).send(response);
    } else {
      return res.status(500).send({
        message: "no se pudo iniciar sesion",
      });
    }
  });

export default authRouter;
