import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

export const seleccionarReparacion = async (req, res) => {
  try {
    const query = `
      SELECT r.id_reparacion, r.fecha_solicitud, r.fecha_entrega, r.descripcion, c.nombre AS nombre_cliente, e.marca AS nombre_equipo, e.modelo AS modelo_equipo, r.monto_servicio, r.estado
      FROM Reparacion r
      JOIN Cliente c ON r.id_cliente = c.id_cliente
      JOIN Equipo e ON r.id_equipo = e.id_equipo
      WHERE r.estado = 1
    `;
    const [rows] = await db_pool_connection.query(query);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontraron reparaciones"));
    } else {
      res.status(200).json(response_success(rows, "Reparaciones encontradas"));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al obtener las reparaciones"));
  }
};

export const seleccionarReparacionPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT r.id_reparacion, r.fecha_solicitud, r.fecha_entrega, r.descripcion, c.nombre AS nombre_cliente, e.marca AS nombre_equipo, e.modelo AS modelo_equipo, r.monto_servicio, r.estado
      FROM Reparacion r
      JOIN Cliente c ON r.id_cliente = c.id_cliente
      JOIN Equipo e ON r.id_equipo = e.id_equipo
      WHERE r.id_reparacion = ? AND r.estado = 1
    `;
    const [rows] = await db_pool_connection.query(query, [id]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found(`No se encontró la reparación con ID ${id}`));
    } else {
      res.status(200).json(response_success(rows[0], "Reparación encontrada"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener la reparación"));
  }
};

export const seleccionarReparacionPorCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const query = `
      SELECT r.id_reparacion, r.fecha_solicitud, r.fecha_entrega, r.descripcion, e.marca AS nombre_equipo, e.modelo AS modelo_equipo, r.monto_servicio, r.estado
      FROM Reparacion r
      JOIN Equipo e ON r.id_equipo = e.id_equipo
      WHERE r.id_cliente = ? AND r.estado = 1
    `;
    const [rows] = await db_pool_connection.query(query, [id_cliente]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(
          response_not_found(
            `No se encontraron reparaciones para el cliente con ID ${id_cliente}`
          )
        );
    } else {
      res.status(200).json(response_success(rows, "Reparaciones encontradas"));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al obtener las reparaciones"));
  }
};

export const insertarReparacion = async (req, res) => {
  try {
    const {
      fecha_solicitud,
      fecha_entrega,
      descripcion,
      id_cliente,
      id_equipo,
      id_tecnico,
      id_estado_reparacion,
      monto_servicio,
    } = req.body;

    if (
      !fecha_solicitud ||
      !descripcion ||
      !id_cliente ||
      !id_equipo ||
      !id_estado_reparacion ||
      !monto_servicio
    ) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "Todos los campos obligatorios deben ser proporcionados"
          )
        );
    }

    const query = `
      INSERT INTO Reparacion (fecha_solicitud, fecha_entrega, descripcion, id_cliente, id_equipo, id_tecnico, id_estado_reparacion, monto_servicio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db_pool_connection.query(query, [
      fecha_solicitud,
      fecha_entrega,
      descripcion,
      id_cliente,
      id_equipo,
      id_tecnico,
      id_estado_reparacion,
      monto_servicio,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(201)
        .json(
          response_created(
            { id_reparacion: result.insertId },
            "Reparación creada con éxito"
          )
        );
    } else {
      res
        .status(500)
        .json(response_error(500, "No se pudo crear la reparación"));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al insertar la reparación"));
  }
};

export const actualizarReparacion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha_solicitud,
      fecha_entrega,
      descripcion,
      id_equipo,
      id_tecnico,
      id_estado_reparacion,
      monto_servicio,
    } = req.body;

    if (
      !fecha_solicitud ||
      !descripcion ||
      !id_equipo ||
      !id_estado_reparacion ||
      !monto_servicio
    ) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "Todos los campos obligatorios deben ser proporcionados"
          )
        );
    }

    const query = `
      UPDATE Reparacion
      SET fecha_solicitud = ?, fecha_entrega = ?, descripcion = ?, id_equipo = ?, id_tecnico = ?, id_estado_reparacion = ?, monto_servicio = ?
      WHERE id_reparacion = ?
    `;
    const [result] = await db_pool_connection.query(query, [
      fecha_solicitud,
      fecha_entrega,
      descripcion,
      id_equipo,
      id_tecnico,
      id_estado_reparacion,
      monto_servicio,
      id,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Reparación actualizada con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró la reparación con ID ${id}`));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al actualizar la reparación"));
  }
};

export const eliminarReparacion = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE Reparacion
      SET estado = 0
      WHERE id_reparacion = ?
    `;
    const [result] = await db_pool_connection.query(query, [id]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Reparación eliminada con éxito"));
    } else {
      res
        .status(404)
        .json(response_not_found(`No se encontró la reparación con ID ${id}`));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al eliminar la reparación"));
  }
};
