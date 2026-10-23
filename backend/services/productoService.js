import * as productoRepository from "../repositories/productoRepository.js";

export const listarProductos = async () => {
  return productoRepository.obtenerTodos();
};

export const buscarProducto = async (id) => {
  return productoRepository.obtenerPorId(id);
};

export const registrarProducto = async (datos) => {
  if (!datos.nombre?.trim()) {
    const error = new Error("El nombre es obligatorio");
    error.status = 400;
    throw error;
  }

  if (
    datos.precio === undefined ||
    datos.precio === null ||
    datos.precio === "" ||
    !Number.isFinite(Number(datos.precio)) ||
    Number(datos.precio) < 0
  ) {
    const error = new Error("El precio no es válido");
    error.status = 400;
    throw error;
  }

  return productoRepository.crear({
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion ?? null,
    precio: Number(datos.precio),
    stock: datos.stock ?? 0,
    imagen_url: datos.imagen_url ?? null,
  });
};