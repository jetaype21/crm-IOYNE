import { Pool } from "pg";

// conexiom a la base de datos
const pool = new Pool({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "IOYNE",
});

export default pool;
