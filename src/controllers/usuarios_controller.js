import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

// Seleccionar todos los usuarios activos
export const seleccionarUsuarios = async (req, res) => {
  try {
    const query = "CALL seleccionarUsuarios();";

    const [rows] = await db_pool_connection.query(query);

    if (rows[0].length === 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontraron usuarios activos"));
    } else {
      res.status(200).json(response_success(rows[0], "Usuarios encontrados"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener los usuarios"));
  }
};

// Seleccionar un usuario por ID
export const seleccionarUsuarioPorId = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;

    if (!id_usuario) {
      return res
        .status(400)
        .json(response_bad_request("El ID del usuario es requerido"));
    }

    const query = "CALL seleccionarUsuarioPorId(?);";

    const [rows] = await db_pool_connection.query(query, [id_usuario]);

    if (rows[0].length === 0) {
      return res.status(404).json(response_not_found("Usuario no encontrado"));
    } else {
      res.status(200).json(response_success(rows[0], "Usuario encontrado"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener el usuario"));
  }
};

// Insertar un nuevo usuario
export const insertarUsuario = async (req, res) => {
  try {
    const { nombre_usuario, contrasena, rol, id_cliente } = req.body;

    if (!nombre_usuario || !contrasena || !rol || !id_cliente) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "Todos los campos obligatorios deben ser completados"
          )
        );
    }

    const query = "CALL insertarUsuario(?, ?, ?, ?);";

    const [result] = await db_pool_connection.query(query, [
      nombre_usuario,
      contrasena,
      rol,
      id_cliente,
    ]);

    res
      .status(201)
      .json(response_created(result.insertId, "Usuario creado correctamente"));
  } catch (error) {
    res.status(500).json(response_error(500, "Error al crear el usuario"));
  }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;
    const { nombre_usuario, contrasena, rol, id_cliente } = req.body;

    if (!id_usuario) {
      return res
        .status(400)
        .json(response_bad_request("El ID del usuario es requerido"));
    }

    const query = "CALL actualizarUsuario(?, ?, ?, ?, ?);";

    const [result] = await db_pool_connection.query(query, [
      id_usuario,
      nombre_usuario,
      contrasena,
      rol,
      id_cliente,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json(response_not_found("Usuario no encontrado"));
    }

    res
      .status(200)
      .json(response_success(result, "Usuario actualizado correctamente"));
  } catch (error) {
    res.status(500).json(response_error(500, "Error al actualizar el usuario"));
  }
};

// Eliminar (inactivar) un usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;

    if (!id_usuario) {
      return res
        .status(400)
        .json(response_bad_request("El ID del usuario es requerido"));
    }

    const query = "CALL eliminarUsuario(?);";

    const [result] = await db_pool_connection.query(query, [id_usuario]);

    if (result.affectedRows === 0) {
      return res.status(404).json(response_not_found("Usuario no encontrado"));
    }

    res
      .status(200)
      .json(response_success(null, "Usuario eliminado correctamente"));
  } catch (error) {
    res.status(500).json(response_error(500, "Error al eliminar el usuario"));
  }
};

// Login de usuario (autenticación)
export const loginUsuario = async (req, res) => {
  try {
    const { nombre_usuario, contrasena } = req.body;

    if (!nombre_usuario || !contrasena) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "El nombre de usuario y la contraseña son requeridos"
          )
        );
    }

    const query = "CALL loginUsuario(?, ?);";

    const [rows] = await db_pool_connection.query(query, [
      nombre_usuario,
      contrasena,
    ]);

    if (rows[0].length === 0) {
      return res
        .status(401)
        .json(response_error(401, "Credenciales inválidas"));
    } else {
      res.status(200).json(response_success(rows[0], "Login exitoso"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al realizar login"));
  }
};
