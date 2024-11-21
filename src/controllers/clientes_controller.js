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
      WHERE estado = 1  -- Solo clientes activos
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

export const seleccionarClientePorId = async (req, res) => {
  try {
    const id_cliente = req.params.id_cliente;

    if (!id_cliente) {
      return res
        .status(400)
        .json(response_bad_request("El ID del cliente es requerido"));
    }

    const query = `
      SELECT id_cliente, nombre, telefono, email, direccion, estado
      FROM Cliente
      WHERE id_cliente = ? AND estado = 1  -- Solo clientes activos
    `;
    const [rows] = await db_pool_connection.query(query, [id_cliente]);

    if (rows.length <= 0) {
      return res.status(404).json(response_not_found("Cliente no encontrado"));
    } else {
      res.status(200).json(response_success(rows[0], "Cliente encontrado"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener cliente"));
  }
};

export const insertarCliente = async (req, res) => {
  try {
    const { nombre, telefono, email, direccion, estado } = req.body;

    if (!nombre || !email || !direccion) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "Los campos nombre, email y dirección son obligatorios"
          )
        );
    }

    const [rows] = await db_pool_connection.query(
      "INSERT INTO Cliente (nombre, telefono, email, direccion, estado) VALUES (?, ?, ?, ?, ?)",
      [nombre, telefono, email, direccion, estado || 1]
    );

    res
      .status(201)
      .json(response_created(rows.insertId, "Cliente creado correctamente"));
  } catch (error) {
    res.status(500).json(response_error(500, "Error al crear cliente"));
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const id_cliente = req.params.id_cliente;
    const { nombre, telefono, email, direccion, estado } = req.body;

    if (!id_cliente) {
      return res
        .status(400)
        .json(response_bad_request("El ID del cliente es requerido"));
    }

    const [result] = await db_pool_connection.query(
      "UPDATE Cliente SET nombre = ?, telefono = ?, email = ?, direccion = ?, estado = ? WHERE id_cliente = ?",
      [nombre, telefono, email, direccion, estado, id_cliente]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(response_not_found("Cliente no encontrado"));
    } else {
      res
        .status(200)
        .json(response_success(result, "Cliente actualizado correctamente"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al actualizar cliente"));
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const id_cliente = req.params.id_cliente;

    if (!id_cliente) {
      return res
        .status(400)
        .json(response_bad_request("El ID del cliente es requerido"));
    }

    const [result] = await db_pool_connection.query(
      "UPDATE Cliente SET estado = 0 WHERE id_cliente = ?",
      [id_cliente]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json(response_not_found("Cliente no encontrado"));
    }

    res
      .status(200)
      .json(response_success(null, "Cliente eliminado correctamente"));
  } catch (error) {
    res
      .status(500)
      .json(
        response_error(500, "Error al realizar el borrado lógico del cliente")
      );
  }
};
