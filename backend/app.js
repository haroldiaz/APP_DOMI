
import express from "express";
import cors from "cors";

import productoRoutes from "./routes/productoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de APP DOMI funcionando correctamente",
  });
});

// Rutas de productos
app.use("/api/productos", productoRoutes);

export default app;
