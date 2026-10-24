
import express from "express";
import cors from "cors";
import productoRoutes from "./routes/productoRoutes.js";
import domiciliarioRoutes from "./routes/domiciliarioRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de APP DOMI funcionando correctamente",
  });
});

app.use("/api/productos", productoRoutes);
app.use("/api/domiciliarios", domiciliarioRoutes);

export default app;
