
import productoRepository from "../repositories/productoRepository.js";

const errorServicio = (mensaje, statusCode = 400) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  return error;
};

const validarId = (id) => {
  if (!/^[1-9]\d*$/.test(String(id))) {
    throw errorServicio("El ID del producto no es válido");
  }
};

const validarProducto = (datos) => {
  const { nombre, precio, stock = 0 } = datos;

  if (typeof nombre !== "string" || !nombre.trim()) {
    throw errorServicio("El nombre del producto es obligatorio");
  }

  if (
    precio === undefined ||
    precio === null ||
    precio === "" ||
    !Number.isFinite(Number(precio)) ||
    Number(precio) < 0
  ) {
    throw errorServicio("El precio debe ser un número mayor o igual a cero");
  }

  if (
    stock === "" ||
    !Number.isInteger(Number(stock)) ||
    Number(stock) < 0
  ) {
    throw errorServicio("El stock debe ser un entero mayor o igual a cero");
  }
};

const normalizarProducto = (datos) => ({
  nombre: datos.nombre.trim(),
  descripcion: datos.descripcion?.trim() || null,
  precio: Number(datos.precio),
  stock: Number(datos.stock ?? 0),
  imagen_url: datos.imagen_url?.trim() || null,
});

const productoService = {
  async obtenerProductos() {
    return productoRepository.obtenerTodos();
  },

  async obtenerProductoPorId(id) {
    validarId(id);

    const producto = await productoRepository.obtenerPorId(id);

    if (!producto) {
      throw errorServicio("Producto no encontrado", 404);
    }

    return producto;
  },

  async crearProducto(datos) {
    validarProducto(datos);

    return productoRepository.crear(normalizarProducto(datos));
  },

  async actualizarProducto(id, datos) {
    validarId(id);
    validarProducto(datos);

    if (typeof datos.estado !== "boolean") {
      throw errorServicio("El estado del producto no es válido");
    }

    const producto = await productoRepository.actualizar(
      id,
      {
        ...normalizarProducto(datos),
        estado: datos.estado,
      }
    );

    if (!producto) {
      throw errorServicio("Producto no encontrado", 404);
    }

    return producto;
  },

  async eliminarProducto(id) {
    validarId(id);

    const producto = await productoRepository.desactivar(id);

    if (!producto) {
      throw errorServicio(
        "Producto no encontrado o ya está desactivado",
        404
      );
    }

    return producto;
  },
};

export default productoService;
