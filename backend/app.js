import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de APP DOMI funcionando correctamente"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    estado: "OK",
    mensaje: "Servidor disponible"
  });
});

export default app;