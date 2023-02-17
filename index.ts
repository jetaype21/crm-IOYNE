// Importaciones
import dotenv from "dotenv";
import { LogSuccess } from "./src/utils/logger";

// SERVIDOR y otras rutas
import server from "./src/server";

const puerto: number | string = process.env.PORT || 8000;

server.listen(puerto, () => {
  LogSuccess(
    `El servidor esta corriendo en el puerto http://localhost:${puerto}`
  );
});

// iniciar dotenv
dotenv.config();
