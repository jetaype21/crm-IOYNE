import express, { Express, Response, Request } from "express";

// seguridad
import cors from "cors";
import helmet from "helmet";

import rootRouter from "../routes";

// Iniciar sevidor
const server: Express = express();
server.use(helmet());
server.use(cors());

// Configuracion del servidor
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json());

// * vincular ruta principal
server.use("/api", rootRouter);

// * redireccion
server.get("/", (req: Request, res: Response) => {
  res.redirect("/api");
});

export default server;
