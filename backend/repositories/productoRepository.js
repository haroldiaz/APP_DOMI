import pool from "../config/db.js";

export const obtenerTodos = async () => {
  const resultado = await pool.query(
    "SELECT * FROM productos ORDER BY id DESC"
  );

  return resultado.rows;
};

export const obtenerPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM productos WHERE id = $1",
    [id]
  );

  return resultado.rows[0] ?? null;
};

export const crear = async (producto) => {
  const { nombre, descripcion, precio, stock, imagen_url } = producto;

  const resultado = await pool.query(
    `INSERT INTO productos
      (nombre, descripcion, precio, stock, imagen_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [nombre, descripcion, precio, stock, imagen_url]
  );

  return resultado.rows[0];
};