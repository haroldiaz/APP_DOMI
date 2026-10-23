
import pkg from "pg";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

const { Pool } = pkg;

// Ruta del archivo .env ubicado un nivel por encima
const envPath = path.resolve(process.cwd(), "../backend/.env");

console.log("📂 Carpeta actual:", process.cwd());
console.log("📄 Ruta del .env:", envPath);
console.log("📄 Existe el .env:", fs.existsSync(envPath));

// Cargar variables de entorno
const resultado = dotenv.config({ path: envPath });


// Variables de PostgreSQL
const DB_USER = process.env.DB_USER ;
const DB_HOST = process.env.DB_HOST ;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD ;
const DB_PORT = Number(process.env.DB_PORT);



// Crear conexión
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

// Probar conexión
pool
  .connect()
  .then((client) => {
    console.log("✅ Conectado exitosamente a PostgreSQL");
    client.release();
  })
  .catch((err) => {
    console.error(
      "❌ Error al conectar a PostgreSQL:",
      err.message
    );
  });

export default pool;

