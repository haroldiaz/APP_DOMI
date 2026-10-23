
import pool from "../config/db.js";

export const productoRepository = {
  async obtenerTodos() {
    const resultado = await pool.query(`
      SELECT *
      FROM productos
      WHERE estado = TRUE
      ORDER BY id DESC
    `);

    return resultado.rows;
  },

  async obtenerPorId(id) {
    const resultado = await pool.query(
      "SELECT * FROM productos WHERE id = $1",
      [id]
    );

    return resultado.rows[0] ?? null;
  },

  async crear(producto) {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen_url,
    } = producto;

    const resultado = await pool.query(
      `INSERT INTO productos
        (nombre, descripcion, precio, stock, imagen_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        nombre,
        descripcion,
        precio,
        stock,
        imagen_url,
      ]
    );

    return resultado.rows[0];
  },

  async actualizar(id, producto) {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen_url,
      estado,
    } = producto;

    const resultado = await pool.query(
      `UPDATE productos
       SET nombre = $1,
           descripcion = $2,
           precio = $3,
           stock = $4,
           imagen_url = $5,
           estado = $6,
           actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        nombre,
        descripcion,
        precio,
        stock,
        imagen_url,
        estado,
        id,
      ]
    );

    return resultado.rows[0] ?? null;
  },

  async desactivar(id) {
    const resultado = await pool.query(
      `UPDATE productos
       SET estado = FALSE,
           actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $1
         AND estado = TRUE
       RETURNING *`,
      [id]
    );

    return resultado.rows[0] ?? null;
  },
};

export default productoRepository;
