import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

export const seleccionarClientes = async (req, res) => {
  try {
    const query = `
      SELECT id_cliente, nombre, telefono, email, direccion, estado
      FROM Cliente
      WHERE estado = 1
    `;
    const [rows] = await db_pool_connection.query(query);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontraron clientes activos"));
    } else {
      res.status(200).json(response_success(rows, "Clientes encontrados"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener clientes"));
  }
};

export const seleccionarClientesPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT id_cliente, nombre, telefono, email, direccion, estado
      FROM Cliente
      WHERE id_cliente = ? AND estado = 1
    `;
    const [rows] = await db_pool_connection.query(query, [id]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found(`No se encontró el cliente con ID ${id}`));
    } else {
      res.status(200).json(response_success(rows[0], "Cliente encontrado"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener el cliente"));
  }
};

export const insertarCliente = async (req, res) => {
  try {
    const {
      nombre,
      telefono,
      email,
      direccion,
      nombre_usuario,
      contrasena,
      rol,
    } = req.body;

    if (
      !nombre ||
      !telefono ||
      !email ||
      !direccion ||
      !nombre_usuario ||
      !contrasena ||
      !rol
    ) {
      return res
        .status(400)
        .json(response_bad_request("Todos los campos son obligatorios"));
    }
    const queryEmail = `SELECT id_cliente FROM Cliente WHERE email = ?`;
    const [emailExists] = await db_pool_connection.query(queryEmail, [email]);

    if (emailExists.length > 0) {
      console.log("error");
      return res
        .status(400)
        .json(
          response_bad_request(400, "El correo electrónico ya está registrado")
        );
    }

    const queryUsuario = `SELECT id_usuario FROM Usuario WHERE nombre_usuario = ?`;
    const [usuarioExists] = await db_pool_connection.query(queryUsuario, [
      nombre_usuario,
    ]);

    if (usuarioExists.length > 0) {
      return res
        .status(400)
        .json(
          response_bad_request(400, "El nombre de usuario ya está registrado")
        );
    }

    // Insertar el nuevo cliente
    const queryCliente = `
      INSERT INTO Cliente (nombre, telefono, email, direccion)
      VALUES (?, ?, ?, ?)
    `;
    const [resultCliente] = await db_pool_connection.query(queryCliente, [
      nombre,
      telefono,
      email,
      direccion,
    ]);

    if (resultCliente.affectedRows > 0) {
      const id_cliente = resultCliente.insertId;

      // Insertar el nuevo usuario
      const queryInsertUsuario = `
        INSERT INTO Usuario (nombre_usuario, contrasena, rol, id_cliente)
        VALUES (?, ?, ?, ?)
      `;
      const [resultUsuario] = await db_pool_connection.query(
        queryInsertUsuario,
        [nombre_usuario, contrasena, rol, id_cliente]
      );

      if (resultUsuario.affectedRows > 0) {
        res.status(201).json(
          response_created(
            {
              id_cliente: resultCliente.insertId,
              id_usuario: resultUsuario.insertId,
            },
            "Cliente y usuario creados con éxito"
          )
        );
      } else {
        res
          .status(500)
          .json(response_error(500, "No se pudo crear el usuario"));
      }
    } else {
      res.status(500).json(response_error(500, "No se pudo crear el cliente"));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al insertar el cliente o usuario"));
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email, direccion } = req.body;

    if (!nombre || !telefono || !email || !direccion) {
      return res
        .status(400)
        .json(response_bad_request("Todos los campos son obligatorios"));
    }

    const query = `
      UPDATE Cliente
      SET nombre = ?, telefono = ?, email = ?, direccion = ?
      WHERE id_cliente = ? AND estado = 1
    `;
    const [result] = await db_pool_connection.query(query, [
      nombre,
      telefono,
      email,
      direccion,
      id,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Cliente actualizado con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró el cliente con ID ${id}`));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al actualizar el cliente"));
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE Cliente
      SET estado = 0
      WHERE id_cliente = ?
    `;
    const [result] = await db_pool_connection.query(query, [id]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Cliente eliminado con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró el cliente con ID ${id}`));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al eliminar el cliente"));
  }
};
