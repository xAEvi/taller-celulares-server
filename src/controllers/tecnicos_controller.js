import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

export const seleccionarTecnicos = async (req, res) => {
  try {
    const query = `
      SELECT id_tecnico, nombre, telefono, email, estado
      FROM Tecnico
      WHERE estado = 1
    `;
    const [rows] = await db_pool_connection.query(query);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontraron técnicos"));
    } else {
      res.status(200).json(response_success(rows, "Técnicos encontrados"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener técnicos"));
  }
};

export const seleccionarTecnicoPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT id_tecnico, nombre, telefono, email, estado
      FROM Tecnico
      WHERE id_tecnico = ? AND estado = 1
    `;
    const [rows] = await db_pool_connection.query(query, [id]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found(`No se encontró el técnico con ID ${id}`));
    } else {
      res.status(200).json(response_success(rows[0], "Técnico encontrado"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener el técnico"));
  }
};

export const insertarTecnico = async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;

    if (!nombre || !telefono || !email) {
      return res
        .status(400)
        .json(response_bad_request("Todos los campos son obligatorios"));
    }

    const query = `
      INSERT INTO Tecnico (nombre, telefono, email)
      VALUES (?, ?, ?)
    `;
    const [result] = await db_pool_connection.query(query, [
      nombre,
      telefono,
      email,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(201)
        .json(
          response_created(
            { id_tecnico: result.insertId },
            "Técnico creado con éxito"
          )
        );
    } else {
      res.status(500).json(response_error(500, "No se pudo crear el técnico"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al insertar el técnico"));
  }
};

export const actualizarTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email } = req.body;

    if (!nombre || !telefono || !email) {
      return res
        .status(400)
        .json(response_bad_request("Todos los campos son obligatorios"));
    }

    const query = `
      UPDATE Tecnico
      SET nombre = ?, telefono = ?, email = ?
      WHERE id_tecnico = ?
    `;
    const [result] = await db_pool_connection.query(query, [
      nombre,
      telefono,
      email,
      id,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Técnico actualizado con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró el técnico con ID ${id}`));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al actualizar el técnico"));
  }
};

export const eliminarTecnico = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE Tecnico
      SET estado = 0
      WHERE id_tecnico = ?
    `;
    const [result] = await db_pool_connection.query(query, [id]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Técnico eliminado con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró el técnico con ID ${id}`));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al eliminar el técnico"));
  }
};
