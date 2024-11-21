import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

export const seleccionarReparaciones = async (req, res) => {
  try {
    const query = `
      SELECT r.id_reparacion, r.fecha_solicitud, r.fecha_entrega, r.descripcion, 
             e.marca AS equipo, e.modelo AS modelo, c.nombre AS cliente, 
             t.nombre AS tecnico, r.monto_servicio, r.estado
      FROM Reparacion r
      JOIN Cliente c ON r.id_cliente = c.id_cliente
      JOIN Equipo e ON r.id_equipo = e.id_equipo
      LEFT JOIN Tecnico t ON r.id_tecnico = t.id_tecnico 
      WHERE r.estado = 1  -- Solo reparaciones activas
    `;
    const [rows] = await db_pool_connection.query(query);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontraron reparaciones activas"));
    } else {
      res.status(200).json(response_success(rows, "Reparaciones encontradas"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener reparaciones"));
  }
};

export const seleccionarReparacionesPorClienteId = async (req, res) => {
  try {
    const id_cliente = req.params.id_cliente;

    if (!id_cliente) {
      return res
        .status(400)
        .json(response_bad_request("El ID del cliente es requerido"));
    }

    const query = `
      SELECT r.id_reparacion, r.fecha_solicitud, r.fecha_entrega, r.descripcion, 
             e.marca AS equipo, e.modelo AS modelo, c.nombre AS cliente, 
             t.nombre AS tecnico, r.monto_servicio, r.estado
      FROM Reparacion r
      JOIN Cliente c ON r.id_cliente = c.id_cliente
      JOIN Equipo e ON r.id_equipo = e.id_equipo
      LEFT JOIN Tecnico t ON r.id_tecnico = t.id_tecnico
      WHERE r.id_cliente = ? AND r.estado = 1  -- Solo reparaciones activas para este cliente
    `;
    const [rows] = await db_pool_connection.query(query, [id_cliente]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(
          response_not_found(
            "No se encontraron reparaciones activas para este cliente"
          )
        );
    } else {
      res.status(200).json(response_success(rows, "Reparaciones encontradas"));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al obtener reparaciones por cliente"));
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
      estado,
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
          response_bad_request("Los campos obligatorios deben ser completados")
        );
    }

    const [rows] = await db_pool_connection.query(
      "INSERT INTO Reparacion (fecha_solicitud, fecha_entrega, descripcion, id_cliente, id_equipo, id_tecnico, id_estado_reparacion, monto_servicio, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        fecha_solicitud,
        fecha_entrega,
        descripcion,
        id_cliente,
        id_equipo,
        id_tecnico || null,
        id_estado_reparacion,
        monto_servicio,
        estado || 1,
      ]
    );

    res
      .status(201)
      .json(response_created(rows.insertId, "Reparación creada correctamente"));
  } catch (error) {
    res.status(500).json(response_error(500, "Error al crear reparación"));
  }
};

export const actualizarReparacion = async (req, res) => {
  try {
    const id_reparacion = req.params.id_reparacion;
    const {
      fecha_solicitud,
      fecha_entrega,
      descripcion,
      id_cliente,
      id_equipo,
      id_tecnico,
      id_estado_reparacion,
      monto_servicio,
      estado,
    } = req.body;

    if (!id_reparacion) {
      return res
        .status(400)
        .json(response_bad_request("El ID de la reparación es requerido"));
    }

    const [result] = await db_pool_connection.query(
      "UPDATE Reparacion SET fecha_solicitud = ?, fecha_entrega = ?, descripcion = ?, id_cliente = ?, id_equipo = ?, id_tecnico = ?, id_estado_reparacion = ?, monto_servicio = ?, estado = ? WHERE id_reparacion = ?",
      [
        fecha_solicitud,
        fecha_entrega,
        descripcion,
        id_cliente,
        id_equipo,
        id_tecnico,
        id_estado_reparacion,
        monto_servicio,
        estado,
        id_reparacion,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json(response_not_found("Reparación no encontrada"));
    } else {
      res
        .status(200)
        .json(response_success(result, "Reparación actualizada correctamente"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al actualizar reparación"));
  }
};

export const eliminarReparacion = async (req, res) => {
  try {
    const id_reparacion = req.params.id_reparacion;

    if (!id_reparacion) {
      return res
        .status(400)
        .json(response_bad_request("El ID de la reparación es requerido"));
    }

    const [result] = await db_pool_connection.query(
      "UPDATE Reparacion SET estado = 0 WHERE id_reparacion = ?",
      [id_reparacion]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json(response_not_found("Reparación no encontrada"));
    }

    res
      .status(200)
      .json(response_success(null, "Reparación eliminada correctamente"));
  } catch (error) {
    res
      .status(500)
      .json(
        response_error(
          500,
          "Error al realizar el borrado lógico de la reparación"
        )
      );
  }
};
