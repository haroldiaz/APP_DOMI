
import { useCallback, useEffect, useState } from "react";
import API_BASE from "../config/api";

// Normaliza los datos recibidos de la API.
function normalizarProducto(producto) {
  return {
    ...producto,
    precio: Number(producto.precio || 0),
    stock: Number(producto.stock || 0),
    disponible:
      producto.disponible !== undefined
        ? Boolean(producto.disponible)
        : producto.estado !== undefined
          ? Boolean(producto.estado)
          : true,
  };
}

// Función reutilizable para realizar solicitudes HTTP.
async function solicitarAPI(ruta, opciones = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_BASE}${ruta}`, {
      ...opciones,
      headers: {
        ...(opciones.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...opciones.headers,
      },
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que el backend esté iniciado."
    );
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje || `Error en la solicitud (${respuesta.status})`
    );
  }

  return datos;
}

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const [mensaje, setMensaje] = useState({
    abierto: false,
    texto: "",
    tipo: "success",
  });

  // --------------------------------------------------
  // NOTIFICACIONES
  // --------------------------------------------------

  const mostrarMensaje = useCallback((texto, tipo = "success") => {
    setMensaje({
      abierto: true,
      texto,
      tipo,
    });
  }, []);

  const cerrarMensaje = useCallback(() => {
    setMensaje((anterior) => ({
      ...anterior,
      abierto: false,
    }));
  }, []);

  // --------------------------------------------------
  // CARGAR PRODUCTOS
  // --------------------------------------------------

  const cargarProductos = useCallback(async () => {
    setCargando(true);

    try {
      const datos = await solicitarAPI("/productos");

      if (!Array.isArray(datos.productos)) {
        throw new Error(
          "La API no devolvió una lista válida de productos."
        );
      }

      setProductos(datos.productos.map(normalizarProducto));
    } catch (error) {
      mostrarMensaje(
        error.message || "No se pudieron cargar los productos.",
        "error"
      );
    } finally {
      setCargando(false);
    }
  }, [mostrarMensaje]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // --------------------------------------------------
  // VALIDAR FORMULARIO
  // --------------------------------------------------

  function validarFormulario(formulario) {
    const nombre = formulario.nombre.trim();
    const precioTexto = String(formulario.precio).trim();
    const stockTexto = String(formulario.stock).trim();

    const precio = Number(precioTexto);
    const stock = Number(stockTexto);

    if (!nombre || nombre.length > 150) {
      return "El nombre es obligatorio y admite máximo 150 caracteres.";
    }

    if (
      precioTexto === "" ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(precioTexto)
    ) {
      return "Ingresa un precio válido con máximo dos decimales.";
    }

    if (
      stockTexto === "" ||
      !Number.isSafeInteger(stock) ||
      stock < 0 ||
      !/^\d+$/.test(stockTexto)
    ) {
      return "El stock debe ser un entero mayor o igual a cero.";
    }

    const imagen = formulario.imagen_url.trim();

    if (imagen) {
      try {
        const url = new URL(imagen);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        return "Ingresa una URL de imagen válida.";
      }
    }

    return null;
  }

  // --------------------------------------------------
  // CREAR O ACTUALIZAR PRODUCTO
  // --------------------------------------------------

  const guardarProducto = useCallback(
    async ({ productoSeleccionado, formulario }) => {
      const errorValidacion = validarFormulario(formulario);

      if (errorValidacion) {
        mostrarMensaje(errorValidacion, "warning");
        return false;
      }

      const datosProducto = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim() || null,
        precio: Number(formulario.precio),
        stock: Number(formulario.stock),
        imagen_url: formulario.imagen_url.trim() || null,
      };

      setGuardando(true);

      try {
        if (productoSeleccionado) {
          // Actualizar producto existente.
          const respuesta = await solicitarAPI(
            `/productos/${productoSeleccionado.id}`,
            {
              method: "PUT",
              body: JSON.stringify({
                ...datosProducto,
                estado: formulario.disponible,
              }),
            }
          );

          if (!respuesta.producto) {
            throw new Error(
              "El servidor no devolvió el producto actualizado."
            );
          }

          const actualizado = normalizarProducto(
            respuesta.producto
          );

          setProductos((anteriores) =>
            anteriores.map((producto) =>
              String(producto.id) === String(actualizado.id)
                ? actualizado
                : producto
            )
          );

          mostrarMensaje("Producto actualizado correctamente.");
        } else {
          // Crear producto nuevo o duplicado.
          const respuesta = await solicitarAPI("/productos", {
            method: "POST",
            body: JSON.stringify(datosProducto),
          });

          if (!respuesta.producto) {
            throw new Error(
              "El servidor no devolvió el producto registrado."
            );
          }

          const nuevoProducto = normalizarProducto(
            respuesta.producto
          );

          setProductos((anteriores) => [
            nuevoProducto,
            ...anteriores,
          ]);

          mostrarMensaje(
            formulario.nombre.trim().endsWith("(copia)")
              ? "Producto duplicado correctamente."
              : "Producto registrado correctamente."
          );
        }

        return true;
      } catch (error) {
        mostrarMensaje(
          error.message || "No se pudo guardar el producto.",
          "error"
        );

        return false;
      } finally {
        setGuardando(false);
      }
    },
    [mostrarMensaje]
  );

  // --------------------------------------------------
  // DESACTIVAR PRODUCTO
  // --------------------------------------------------

  const eliminarProducto = useCallback(
    async (producto) => {
      if (!producto) return false;

      setEliminando(true);

      try {
        await solicitarAPI(`/productos/${producto.id}`, {
          method: "DELETE",
        });

        setProductos((anteriores) =>
          anteriores.filter(
            (item) => String(item.id) !== String(producto.id)
          )
        );

        mostrarMensaje("Producto desactivado correctamente.");

        return true;
      } catch (error) {
        mostrarMensaje(
          error.message || "No se pudo desactivar el producto.",
          "error"
        );

        return false;
      } finally {
        setEliminando(false);
      }
    },
    [mostrarMensaje]
  );

  return {
    productos,
    cargando,
    guardando,
    eliminando,
    mensaje,
    cargarProductos,
    guardarProducto,
    eliminarProducto,
    mostrarMensaje,
    cerrarMensaje,
  };
}
