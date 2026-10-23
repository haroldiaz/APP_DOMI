import * as productoService from "../services/productoService.js";

export const obtenerProductos = async (req, res, next) => {
  try {
    const productos = await productoService.listarProductos();

    res.status(200).json({
      total: productos.length,
      productos,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerProductoPorId = async (req, res, next) => {
  try {
    const producto = await productoService.buscarProducto(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.status(200).json({ producto });
  } catch (error) {
    next(error);
  }
};

export const crearProducto = async (req, res, next) => {
  try {
    const producto = await productoService.registrarProducto(req.body);

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto,
    });
  } catch (error) {
    next(error);
  }
};