import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

export const seleccionarUsuarios = async (req, res) => {
  try {
    const query = `
      SELECT id_usuario, nombre_usuario, rol, id_cliente, estado
      FROM Usuario
      WHERE estado = 1
    `;
    const [rows] = await db_pool_connection.query(query);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontraron usuarios"));
    } else {
      res.status(200).json(response_success(rows, "Usuarios encontrados"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener usuarios"));
  }
};

export const seleccionarUsuarioPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT id_usuario, nombre_usuario, rol, id_cliente, estado
      FROM Usuario
      WHERE id_usuario = ? AND estado = 1
    `;
    const [rows] = await db_pool_connection.query(query, [id]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found(`No se encontró el usuario con ID ${id}`));
    } else {
      res.status(200).json(response_success(rows[0], "Usuario encontrado"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener el usuario"));
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, contrasena } = req.body;

    if (!nombre_usuario || !contrasena) {
      return res
        .status(400)
        .json(response_bad_request("Todos los campos son obligatorios"));
    }

    const query = `
      UPDATE Usuario
      SET nombre_usuario = ?, contrasena = ?
      WHERE id_usuario = ?
    `;
    const [result] = await db_pool_connection.query(query, [
      nombre_usuario,
      contrasena,
      id,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Usuario actualizado con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró el usuario con ID ${id}`));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al actualizar el usuario"));
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE Usuario
      SET estado = 0
      WHERE id_usuario = ?
    `;
    const [result] = await db_pool_connection.query(query, [id]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Usuario eliminado con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró el usuario con ID ${id}`));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al eliminar el usuario"));
  }
};
