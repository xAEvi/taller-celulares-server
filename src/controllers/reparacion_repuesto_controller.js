import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

export const seleccionarReparacionRepuesto = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT rr.id_reparacion, rr.id_repuesto, r.nombre AS nombre_repuesto, rr.cantidad_usada, rr.estado
      FROM ReparacionRepuesto rr
      JOIN Repuesto r ON rr.id_repuesto = r.id_repuesto
      WHERE rr.id_reparacion = ? AND rr.estado = 1
    `;
    const [rows] = await db_pool_connection.query(query, [id]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(
          response_not_found(
            `No se encontraron repuestos utilizados en la reparación con ID ${id_reparacion}`
          )
        );
    } else {
      res.status(200).json(response_success(rows, "Repuestos encontrados"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        response_error(
          500,
          "Error al obtener los repuestos utilizados en la reparación"
        )
      );
  }
};

export const insertarReparacionRepuesto = async (req, res) => {
  try {
    const { id_reparacion, id_repuesto, cantidad_usada } = req.body;

    if (!id_reparacion || !id_repuesto || !cantidad_usada) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "Todos los campos obligatorios deben ser proporcionados"
          )
        );
    }

    const queryCheckCantidad = `
      SELECT cantidad
      FROM Repuesto
      WHERE id_repuesto = ?
    `;
    const [rows] = await db_pool_connection.query(queryCheckCantidad, [
      id_repuesto,
    ]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontró el repuesto"));
    }

    const cantidadDisponible = rows[0].cantidad;

    if (cantidad_usada > cantidadDisponible) {
      return res
        .status(400)
        .json(
          response_error(
            400,
            "La cantidad utilizada supera la cantidad disponible"
          )
        );
    }

    const queryUpdateRepuesto = `
      UPDATE Repuesto
      SET cantidad = cantidad - ?
      WHERE id_repuesto = ?
    `;
    const [resultUpdateRepuesto] = await db_pool_connection.query(
      queryUpdateRepuesto,
      [cantidad_usada, id_repuesto]
    );

    if (resultUpdateRepuesto.affectedRows === 0) {
      return res
        .status(400)
        .json(
          response_error(400, "No se pudo actualizar la cantidad del repuesto")
        );
    }

    const queryInsert = `
      INSERT INTO ReparacionRepuesto (id_reparacion, id_repuesto, cantidad_usada)
      VALUES (?, ?, ?)
    `;
    const [resultInsert] = await db_pool_connection.query(queryInsert, [
      id_reparacion,
      id_repuesto,
      cantidad_usada,
    ]);

    if (resultInsert.affectedRows > 0) {
      res
        .status(201)
        .json(
          response_created(
            { id_reparacion_repuesto: resultInsert.insertId },
            "Repuesto insertado con éxito"
          )
        );
    } else {
      res
        .status(500)
        .json(
          response_error(
            500,
            "No se pudo insertar el repuesto en la reparación"
          )
        );
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        response_error(500, "Error al insertar el repuesto en la reparación")
      );
  }
};

export const actualizarReparacionRepuesto = async (req, res) => {
  try {
    const { id_reparacion, id_repuesto, cantidad_usada_nueva } = req.body;

    if (!id_reparacion || !id_repuesto || !cantidad_usada_nueva) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "Todos los campos obligatorios deben ser proporcionados"
          )
        );
    }

    const queryGetCantidadAnterior = `
      SELECT cantidad_usada
      FROM ReparacionRepuesto
      WHERE id_reparacion = ? AND id_repuesto = ?
    `;
    const [rows] = await db_pool_connection.query(queryGetCantidadAnterior, [
      id_reparacion,
      id_repuesto,
    ]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(
          response_not_found("No se encontró el repuesto en la reparación")
        );
    }

    const cantidadAnterior = rows[0].cantidad_usada;

    if (cantidad_usada_nueva < cantidadAnterior) {
      const diferencia = cantidadAnterior - cantidad_usada_nueva;

      const queryAgregarDiferencia = `
        UPDATE Repuesto
        SET cantidad = cantidad + ?
        WHERE id_repuesto = ?
      `;
      await db_pool_connection.query(queryAgregarDiferencia, [
        diferencia,
        id_repuesto,
      ]);
    } else if (cantidad_usada_nueva > cantidadAnterior) {
      const diferencia = cantidad_usada_nueva - cantidadAnterior;

      const queryRestarDiferencia = `
        UPDATE Repuesto
        SET cantidad = cantidad - ?
        WHERE id_repuesto = ?
      `;
      await db_pool_connection.query(queryRestarDiferencia, [
        diferencia,
        id_repuesto,
      ]);
    }

    const queryActualizarReparacionRepuesto = `
      UPDATE ReparacionRepuesto
      SET cantidad_usada = ?
      WHERE id_reparacion = ? AND id_repuesto = ?
    `;
    const [result] = await db_pool_connection.query(
      queryActualizarReparacionRepuesto,
      [cantidad_usada_nueva, id_reparacion, id_repuesto]
    );

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(response_success(null, "Repuesto actualizado con éxito"));
    } else {
      res
        .status(500)
        .json(
          response_error(
            500,
            "No se pudo actualizar el repuesto en la reparación"
          )
        );
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        response_error(500, "Error al actualizar el repuesto en la reparación")
      );
  }
};

export const eliminarReparacionRepuesto = async (req, res) => {
  try {
    const { id_reparacion, id_repuesto } = req.params;

    const queryGetCantidadUsada = `
      SELECT cantidad_usada
      FROM ReparacionRepuesto
      WHERE id_reparacion = ? AND id_repuesto = ?
    `;
    const [rows] = await db_pool_connection.query(queryGetCantidadUsada, [
      id_reparacion,
      id_repuesto,
    ]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(
          response_not_found("No se encontró el repuesto en la reparación")
        );
    }

    const cantidadUsada = rows[0].cantidad_usada;

    const queryUpdateRepuesto = `
      UPDATE Repuesto
      SET cantidad = cantidad + ?
      WHERE id_repuesto = ?
    `;
    const [resultUpdateRepuesto] = await db_pool_connection.query(
      queryUpdateRepuesto,
      [cantidadUsada, id_repuesto]
    );

    if (resultUpdateRepuesto.affectedRows === 0) {
      return res
        .status(400)
        .json(
          response_error(400, "No se pudo restaurar la cantidad del repuesto")
        );
    }

    const queryDelete = `
      DELETE FROM ReparacionRepuesto
      WHERE id_reparacion = ? AND id_repuesto = ?
    `;
    const [resultDelete] = await db_pool_connection.query(queryDelete, [
      id_reparacion,
      id_repuesto,
    ]);

    if (resultDelete.affectedRows > 0) {
      res
        .status(200)
        .json(
          response_success(
            null,
            "Repuesto eliminado con éxito de la reparación"
          )
        );
    } else {
      res
        .status(404)
        .json(
          response_not_found(
            "No se pudo eliminar la relación de repuesto en la reparación"
          )
        );
    }
  } catch (error) {
    res
      .status(500)
      .json(
        response_error(500, "Error al eliminar el repuesto de la reparación")
      );
  }
};
