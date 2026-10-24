
import { domiciliariosRepository } from "../repositories/domiciliarioRepository.js";

const VEHICULOS_VALIDOS = [
  "Motocicleta",
  "Bicicleta",
  "Automóvil",
  "A pie",
];

// Validar que el ID sea un entero positivo
const validarId = (id) => {
  return /^\d+$/.test(String(id)) && Number(id) > 0;
};

// Validar los datos del domiciliario
const validarDomiciliario = (datos) => {
  const {
    nombre,
    documento,
    telefono,
    correo,
    vehiculo,
    placa,
    estado,
  } = datos;

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    nombre.trim().length > 150
  ) {
    return "El nombre es obligatorio y debe tener máximo 150 caracteres.";
  }

  if (
    typeof documento !== "string" &&
    typeof documento !== "number"
  ) {
    return "El documento es obligatorio.";
  }

  if (!/^\d{6,15}$/.test(String(documento))) {
    return "El documento debe contener entre 6 y 15 dígitos.";
  }

  if (
    typeof telefono !== "string" &&
    typeof telefono !== "number"
  ) {
    return "El teléfono es obligatorio.";
  }

  if (!/^3\d{9}$/.test(String(telefono))) {
    return "El celular debe tener 10 dígitos y comenzar por 3.";
  }

  if (
    correo != null &&
    correo !== "" &&
    (typeof correo !== "string" ||
      correo.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
  ) {
    return "El correo electrónico no es válido.";
  }

  if (!VEHICULOS_VALIDOS.includes(vehiculo)) {
    return "El tipo de vehículo no es válido.";
  }

  if (estado !== undefined && typeof estado !== "boolean") {
    return "El estado debe ser verdadero o falso.";
  }

  if (vehiculo === "Motocicleta") {
    if (
      typeof placa !== "string" ||
      !placa.trim() ||
      placa.trim().length > 10
    ) {
      return "La motocicleta debe tener una placa válida.";
    }
  }

  if (
    placa != null &&
    (typeof placa !== "string" || placa.trim().length > 10)
  ) {
    return "La placa debe tener máximo 10 caracteres.";
  }

  return null;
};

// Obtener todos los domiciliarios
export const obtenerDomiciliarios = async (req, res) => {
  try {
    const domiciliarios =
      await domiciliariosRepository.obtenerTodos();

    return res.status(200).json({
      ok: true,
      total: domiciliarios.length,
      data: domiciliarios,
    });
  } catch (error) {
    console.error("Error al obtener domiciliarios:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al consultar los domiciliarios.",
    });
  }
};

// Obtener un domiciliario por ID
export const obtenerDomiciliarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un entero positivo.",
      });
    }

    const domiciliario =
      await domiciliariosRepository.obtenerPorId(Number(id));

    if (!domiciliario) {
      return res.status(404).json({
        ok: false,
        mensaje: "Domiciliario no encontrado.",
      });
    }

    return res.status(200).json({
      ok: true,
      data: domiciliario,
    });
  } catch (error) {
    console.error("Error al consultar domiciliario:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al consultar el domiciliario.",
    });
  }
};

// Crear un domiciliario
export const crearDomiciliario = async (req, res) => {
  try {
    const errorValidacion = validarDomiciliario(req.body);

    if (errorValidacion) {
      return res.status(400).json({
        ok: false,
        mensaje: errorValidacion,
      });
    }

    const datos = {
      ...req.body,
      nombre: req.body.nombre.trim(),
      documento: String(req.body.documento),
      telefono: String(req.body.telefono),
      correo: req.body.correo?.trim() || null,
      placa: req.body.placa?.trim().toUpperCase() || null,
      estado: req.body.estado ?? true,
    };

    const existente =
      await domiciliariosRepository.obtenerPorDocumento(
        datos.documento
      );

    if (existente) {
      return res.status(409).json({
        ok: false,
        mensaje: "Ya existe un domiciliario con ese documento.",
      });
    }

    const domiciliario =
      await domiciliariosRepository.crear(datos);

    return res.status(201).json({
      ok: true,
      mensaje: "Domiciliario creado correctamente.",
      data: domiciliario,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        ok: false,
        mensaje: "El documento o la placa ya están registrados.",
      });
    }

    if (error.code === "23514") {
      return res.status(400).json({
        ok: false,
        mensaje: "Los datos no cumplen las restricciones de la tabla.",
      });
    }

    console.error("Error al crear domiciliario:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al registrar el domiciliario.",
    });
  }
};

// Actualizar un domiciliario
export const actualizarDomiciliario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un entero positivo.",
      });
    }

    const errorValidacion = validarDomiciliario(req.body);

    if (errorValidacion) {
      return res.status(400).json({
        ok: false,
        mensaje: errorValidacion,
      });
    }

    const datos = {
      ...req.body,
      nombre: req.body.nombre.trim(),
      documento: String(req.body.documento),
      telefono: String(req.body.telefono),
      correo: req.body.correo?.trim() || null,
      placa: req.body.placa?.trim().toUpperCase() || null,
      estado: req.body.estado ?? true,
    };

    const actual = await domiciliariosRepository.obtenerPorId(
      Number(id)
    );

    if (!actual) {
      return res.status(404).json({
        ok: false,
        mensaje: "Domiciliario no encontrado.",
      });
    }

    const existente =
      await domiciliariosRepository.obtenerPorDocumento(
        datos.documento
      );

    if (existente && Number(existente.id) !== Number(id)) {
      return res.status(409).json({
        ok: false,
        mensaje: "El documento pertenece a otro domiciliario.",
      });
    }

    const domiciliario =
      await domiciliariosRepository.actualizar(Number(id), datos);

    return res.status(200).json({
      ok: true,
      mensaje: "Domiciliario actualizado correctamente.",
      data: domiciliario,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        ok: false,
        mensaje: "El documento o la placa ya están registrados.",
      });
    }

    if (error.code === "23514") {
      return res.status(400).json({
        ok: false,
        mensaje: "Los datos no cumplen las restricciones de la tabla.",
      });
    }

    console.error("Error al actualizar domiciliario:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar el domiciliario.",
    });
  }
};

// Activar o desactivar un domiciliario
export const cambiarEstadoDomiciliario = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!validarId(id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un entero positivo.",
      });
    }

    if (typeof estado !== "boolean") {
      return res.status(400).json({
        ok: false,
        mensaje: "Debes enviar estado como true o false.",
      });
    }

    const domiciliario =
      await domiciliariosRepository.cambiarEstado(
        Number(id),
        estado
      );

    if (!domiciliario) {
      return res.status(404).json({
        ok: false,
        mensaje: "Domiciliario no encontrado.",
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: `Domiciliario ${
        estado ? "activado" : "desactivado"
      } correctamente.`,
      data: domiciliario,
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al cambiar el estado del domiciliario.",
    });
  }
};

// Eliminar un domiciliario
export const eliminarDomiciliario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un entero positivo.",
      });
    }

    const domiciliario =
      await domiciliariosRepository.eliminar(Number(id));

    if (!domiciliario) {
      return res.status(404).json({
        ok: false,
        mensaje: "Domiciliario no encontrado.",
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: "Domiciliario eliminado correctamente.",
      data: domiciliario,
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(409).json({
        ok: false,
        mensaje:
          "No se puede eliminar: el domiciliario tiene registros relacionados.",
      });
    }

    console.error("Error al eliminar domiciliario:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar el domiciliario.",
    });
  }
};
