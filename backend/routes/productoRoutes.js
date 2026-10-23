
import { Router } from "express";

import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productoController.js";

const router = Router();

// Consultar todos los productos
router.get("/", obtenerProductos);

// Consultar un producto por ID
router.get("/:id", obtenerProductoPorId);

// Registrar un producto
router.post("/", crearProducto);

// Actualizar un producto
router.put("/:id", actualizarProducto);

// Desactivar un producto
router.delete("/:id", eliminarProducto);

export default router;
