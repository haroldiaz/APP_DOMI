
import pool from "../config/db.js";

export const domiciliariosRepository = {
  // Obtener todos los domiciliarios
  async obtenerTodos() {
    const query = `
      SELECT
        id,
        nombre,
        documento,
        telefono,
        correo,
        vehiculo,
        placa,
        estado,
        creado_en,
        actualizado_en
      FROM domiciliarios
      ORDER BY id DESC;
    `;

    const resultado = await pool.query(query);
    return resultado.rows;
  },

  // Buscar un domiciliario por ID
  async obtenerPorId(id) {
    const query = `
      SELECT
        id,
        nombre,
        documento,
        telefono,
        correo,
        vehiculo,
        placa,
        estado,
        creado_en,
        actualizado_en
      FROM domiciliarios
      WHERE id = $1;
    `;

    const resultado = await pool.query(query, [id]);
    return resultado.rows[0] ?? null;
  },

  // Buscar un domiciliario por documento
  async obtenerPorDocumento(documento) {
    const query = `
      SELECT id, documento
      FROM domiciliarios
      WHERE documento = $1;
    `;

    const resultado = await pool.query(query, [documento]);
    return resultado.rows[0] ?? null;
  },

  // Registrar un domiciliario
  async crear(domiciliario) {
    const {
      nombre,
      documento,
      telefono,
      correo,
      vehiculo,
      placa,
      estado = true,
    } = domiciliario;

    const query = `
      INSERT INTO domiciliarios (
        nombre,
        documento,
        telefono,
        correo,
        vehiculo,
        placa,
        estado
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const valores = [
      nombre,
      documento,
      telefono,
      correo || null,
      vehiculo,
      placa || null,
      estado,
    ];

    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  },

  // Actualizar los datos de un domiciliario
  async actualizar(id, domiciliario) {
    const {
      nombre,
      documento,
      telefono,
      correo,
      vehiculo,
      placa,
      estado,
    } = domiciliario;

    const query = `
      UPDATE domiciliarios
      SET
        nombre = $1,
        documento = $2,
        telefono = $3,
        correo = $4,
        vehiculo = $5,
        placa = $6,
        estado = $7,
        actualizado_en = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *;
    `;

    const valores = [
      nombre,
      documento,
      telefono,
      correo || null,
      vehiculo,
      placa || null,
      estado,
      id,
    ];

    const resultado = await pool.query(query, valores);
    return resultado.rows[0] ?? null;
  },

  // Activar o desactivar un domiciliario
  async cambiarEstado(id, estado) {
    const query = `
      UPDATE domiciliarios
      SET
        estado = $1,
        actualizado_en = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const resultado = await pool.query(query, [estado, id]);
    return resultado.rows[0] ?? null;
  },

  // Eliminar un domiciliario
  async eliminar(id) {
    const query = `
      DELETE FROM domiciliarios
      WHERE id = $1
      RETURNING *;
    `;

    const resultado = await pool.query(query, [id]);
    return resultado.rows[0] ?? null;
  },
};
