import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

export const seleccionarRepuestos = async (req, res) => {
  try {
    const query = `
      SELECT id_repuesto, nombre, cantidad, precio, estado
      FROM Repuesto
      WHERE estado = 1
    `;
    const [rows] = await db_pool_connection.query(query);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontraron repuestos"));
    } else {
      res.status(200).json(response_success(rows, "Repuestos encontrados"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener los repuestos"));
  }
};

export const seleccionarRepuestoPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT id_repuesto, nombre, cantidad, precio, estado
      FROM Repuesto
      WHERE id_repuesto = ? AND estado = 1
    `;
    const [rows] = await db_pool_connection.query(query, [id]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found(`No se encontró el repuesto con ID ${id}`));
    } else {
      res.status(200).json(response_success(rows[0], "Repuesto encontrado"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener el repuesto"));
  }
};

export const insertarRepuesto = async (req, res) => {
  try {
    const { nombre, cantidad, precio } = req.body;

    if (!nombre || !cantidad || !precio) {
      return res
        .status(400)
        .json(response_bad_request("Todos los campos son obligatorios"));
    }

    const query = `
      INSERT INTO Repuesto (nombre, cantidad, precio)
      VALUES (?, ?, ?)
    `;
    const [result] = await db_pool_connection.query(query, [
      nombre,
      cantidad,
      precio,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(201)
        .json(
          response_created(
            { id_repuesto: result.insertId },
            "Repuesto creado con éxito"
          )
        );
    } else {
      res.status(500).json(response_error(500, "No se pudo crear el repuesto"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al insertar el repuesto"));
  }
};

export const actualizarRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cantidad, precio } = req.body;

    if (!nombre || !cantidad || !precio) {
      return res
        .status(400)
        .json(response_bad_request("Todos los campos son obligatorios"));
    }

    const query = `
      UPDATE Repuesto
      SET nombre = ?, cantidad = ?, precio = ?
      WHERE id_repuesto = ?
    `;
    const [result] = await db_pool_connection.query(query, [
      nombre,
      cantidad,
      precio,
      id,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Repuesto actualizado con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró el repuesto con ID ${id}`));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al actualizar el repuesto"));
  }
};

export const eliminarRepuesto = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE Repuesto
      SET estado = 0
      WHERE id_repuesto = ?
    `;
    const [result] = await db_pool_connection.query(query, [id]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Repuesto eliminado con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró el repuesto con ID ${id}`));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al eliminar el repuesto"));
  }
};
