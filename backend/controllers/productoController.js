
import pool from "../config/db.js";

// GET /api/productos
// Consultar todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT *
      FROM productos
      ORDER BY id DESC
    `);

    return res.status(200).json({
      mensaje: "Productos consultados correctamente",
      total: resultado.rowCount,
      productos: resultado.rows,
    });
  } catch (error) {
    console.error("Error al consultar productos:", error.message);

    return res.status(500).json({
      mensaje: "Error al consultar los productos",
    });
  }
};

// GET /api/productos/:id
// Consultar un producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensaje: "El ID del producto no es válido",
      });
    }

    const resultado = await pool.query(
      "SELECT * FROM productos WHERE id = $1",
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      producto: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al consultar producto:", error.message);

    return res.status(500).json({
      mensaje: "Error al consultar el producto",
    });
  }
};

// POST /api/productos
// Registrar un producto
export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion = null,
      precio,
      stock = 0,
      imagen_url = null,
    } = req.body;

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      nombre.trim().length > 150
    ) {
      return res.status(400).json({
        mensaje: "El nombre es obligatorio y debe tener máximo 150 caracteres",
      });
    }

    const precioNumero = Number(precio);
    const stockNumero = Number(stock);

    if (
      precio === undefined ||
      precio === null ||
      precio === "" ||
      !Number.isFinite(precioNumero) ||
      precioNumero < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(String(precio).trim())
    ) {
      return res.status(400).json({
        mensaje: "El precio debe ser un número válido no negativo con máximo 2 decimales",
      });
    }

    if (
      !Number.isSafeInteger(stockNumero) ||
      stockNumero < 0 ||
      !/^\d+$/.test(String(stock).trim())
    ) {
      return res.status(400).json({
        mensaje: "El stock debe ser un número entero no negativo",
      });
    }

    if (
      descripcion !== null &&
      typeof descripcion !== "string"
    ) {
      return res.status(400).json({
        mensaje: "La descripción debe ser un texto",
      });
    }

    if (
      imagen_url !== null &&
      typeof imagen_url !== "string"
    ) {
      return res.status(400).json({
        mensaje: "La URL de la imagen debe ser un texto",
      });
    }

    const resultado = await pool.query(
      `INSERT INTO productos
        (nombre, descripcion, precio, stock, imagen_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        nombre.trim(),
        descripcion,
        precioNumero,
        stockNumero,
        imagen_url,
      ]
    );

    return res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al crear producto:", error.message);

    return res.status(500).json({
      mensaje: "Error al registrar el producto",
    });
  }
};

// PUT /api/productos/:id
// Actualizar un producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen_url,
      estado,
    } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensaje: "El ID del producto no es válido",
      });
    }

    const camposPermitidos = {
      nombre,
      descripcion,
      precio,
      stock,
      imagen_url,
      estado,
    };

    const campos = Object.entries(camposPermitidos).filter(
      ([, valor]) => valor !== undefined
    );

    if (campos.length === 0) {
      return res.status(400).json({
        mensaje: "Debes enviar al menos un campo para actualizar",
      });
    }

    const datos = {};

    for (const [campo, valor] of campos) {
      if (campo === "nombre") {
        if (
          typeof valor !== "string" ||
          !valor.trim() ||
          valor.trim().length > 150
        ) {
          return res.status(400).json({
            mensaje: "El nombre es obligatorio y debe tener máximo 150 caracteres",
          });
        }

        datos[campo] = valor.trim();
      } else if (campo === "precio") {
        if (
          valor === null ||
          valor === "" ||
          !Number.isFinite(Number(valor)) ||
          Number(valor) < 0 ||
          !/^\d+(\.\d{1,2})?$/.test(String(valor).trim())
        ) {
          return res.status(400).json({
            mensaje: "El precio debe ser válido y tener máximo 2 decimales",
          });
        }

        datos[campo] = Number(valor);
      } else if (campo === "stock") {
        if (
          valor === null ||
          !Number.isSafeInteger(Number(valor)) ||
          Number(valor) < 0 ||
          !/^\d+$/.test(String(valor).trim())
        ) {
          return res.status(400).json({
            mensaje: "El stock debe ser un entero no negativo",
          });
        }

        datos[campo] = Number(valor);
      } else if (campo === "estado") {
        if (typeof valor !== "boolean") {
          return res.status(400).json({
            mensaje: "El estado debe ser true o false",
          });
        }

        datos[campo] = valor;
      } else if (campo === "descripcion" || campo === "imagen_url") {
        if (valor !== null && typeof valor !== "string") {
          return res.status(400).json({
            mensaje: `${campo} debe ser un texto o null`,
          });
        }

        datos[campo] = valor;
      }
    }

    const valores = Object.values(datos);
    const asignaciones = Object.keys(datos).map(
      (campo, indice) => `${campo} = $${indice + 1}`
    );

    asignaciones.push("actualizado_en = CURRENT_TIMESTAMP");

    valores.push(id);

    const consulta = `
      UPDATE productos
      SET ${asignaciones.join(", ")}
      WHERE id = $${valores.length}
      RETURNING *
    `;

    const resultado = await pool.query(consulta, valores);

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error.message);

    return res.status(500).json({
      mensaje: "Error al actualizar el producto",
    });
  }
};

// DELETE /api/productos/:id
// Desactivar producto sin borrar su historial
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        mensaje: "El ID del producto no es válido",
      });
    }

    const resultado = await pool.query(
      `UPDATE productos
       SET estado = FALSE,
           actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $1 AND estado = TRUE
       RETURNING *`,
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        mensaje: "Producto activo no encontrado",
      });
    }

    return res.status(200).json({
      mensaje: "Producto desactivado correctamente",
      producto: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al desactivar producto:", error.message);

    return res.status(500).json({
      mensaje: "Error al desactivar el producto",
    });
  }
};
