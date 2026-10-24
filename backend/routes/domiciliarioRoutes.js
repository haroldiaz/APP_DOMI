
import { Router } from "express";

import {
  obtenerDomiciliarios,
  obtenerDomiciliarioPorId,
  crearDomiciliario,
  actualizarDomiciliario,
  cambiarEstadoDomiciliario,
  eliminarDomiciliario,
} from "../controllers/domiciliarioController.js";

const router = Router();

// GET: Obtener todos los domiciliarios
router.get("/", obtenerDomiciliarios);

// GET: Obtener un domiciliario por ID
router.get("/:id", obtenerDomiciliarioPorId);

// POST: Crear un domiciliario
router.post("/", crearDomiciliario);

// PUT: Actualizar los datos de un domiciliario
router.put("/:id", actualizarDomiciliario);

// PATCH: Activar o desactivar un domiciliario
router.patch("/:id/estado", cambiarEstadoDomiciliario);

// DELETE: Eliminar un domiciliario
router.delete("/:id", eliminarDomiciliario);

export default router;
