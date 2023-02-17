import express, { Express, Request, Response } from "express";
import { LogSuccess } from "../utils/logger";

// instancia del sevidor y ruta principal
const server: Express = express();
let rootRouter = express.Router();
import authRouter from "./AuthRouter";

// peticion principal
rootRouter.get("/", (req: Request, res: Response) => {
  LogSuccess("Peticion en la ruta principal http://localhost:8000/api");
  res.send("Te saluda taypeDev");
});

// todas las rutas
server.use("/", rootRouter);
server.use("/auth", authRouter);

export default server;
