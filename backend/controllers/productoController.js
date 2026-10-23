
import productoService from "../services/productoService.js";

const manejarError = (res, error) => {
  console.error("Error en productos:", error);

  res.status(error.statusCode || 500).json({
    mensaje:
      error.statusCode
        ? error.message
        : "Ocurrió un error interno al procesar el producto",
  });
};

// GET /api/productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoService.obtenerProductos();
    return res.json({ productos });
  } catch (error) {
    return manejarError(res, error);
  }
};

// GET /api/productos/:id
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await productoService.obtenerProductoPorId(
      req.params.id
    );

    return res.json({ producto });
  } catch (error) {
    return manejarError(res, error);
  }
};

// POST /api/productos
export const crearProducto = async (req, res) => {
  try {
    const producto = await productoService.crearProducto(req.body);

    return res.status(201).json({
      mensaje: "Producto registrado correctamente",
      producto,
    });
  } catch (error) {
    return manejarError(res, error);
  }
};

// PUT /api/productos/:id
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await productoService.actualizarProducto(
      req.params.id,
      req.body
    );

    return res.json({
      mensaje: "Producto actualizado correctamente",
      producto,
    });
  } catch (error) {
    return manejarError(res, error);
  }
};

// DELETE /api/productos/:id
export const eliminarProducto = async (req, res) => {
  try {
    await productoService.eliminarProducto(req.params.id);

    return res.json({
      mensaje: "Producto desactivado correctamente",
    });
  } catch (error) {
    return manejarError(res, error);
  }
};
