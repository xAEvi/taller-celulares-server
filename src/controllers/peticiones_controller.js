import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

export const seleccionarPeticionesReparacion = async (req, res) => {
  try {
    const query = `
      SELECT pr.id_peticion, pr.descripcion, e.marca AS nombre_equipo, e.modelo AS modelo_equipo, c.nombre AS nombre_cliente, pr.id_cliente, pr.fecha_peticion, pr.estado
      FROM PeticionReparacion pr
      JOIN Equipo e ON pr.id_equipo = e.id_equipo
      JOIN Cliente c ON pr.id_cliente = c.id_cliente
      WHERE estado = 1
    `;
    const [rows] = await db_pool_connection.query(query);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontraron peticiones de reparación"));
    } else {
      res
        .status(200)
        .json(response_success(rows, "Peticiones de reparación encontradas"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        response_error(500, "Error al obtener las peticiones de reparación")
      );
  }
};

export const seleccionarPeticionReparacionPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT id_peticion, descripcion, id_equipo, id_cliente, fecha_peticion, estado
      FROM PeticionReparacion
      WHERE id_peticion = ? AND estado = 1
    `;
    const [rows] = await db_pool_connection.query(query, [id]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(
          response_not_found(
            `No se encontró la petición de reparación con ID ${id}`
          )
        );
    } else {
      res
        .status(200)
        .json(response_success(rows[0], "Petición de reparación encontrada"));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al obtener la petición de reparación"));
  }
};

export const seleccionarPeticionesReparacionPorCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const query = `
      SELECT pr.id_peticion, pr.descripcion, e.marca AS nombre_equipo, e.modelo AS modelo_equipo, pr.id_cliente, pr.fecha_peticion, pr.estado
      FROM PeticionReparacion pr
      JOIN Equipo e ON pr.id_equipo = e.id_equipo
      WHERE pr.id_cliente = ?
    `;
    const [rows] = await db_pool_connection.query(query, [id_cliente]);

    if (rows.length <= 0) {
      return res
        .status(404)
        .json(
          response_not_found(
            `No se encontraron peticiones de reparación para el cliente con ID ${id_cliente}`
          )
        );
    } else {
      res
        .status(200)
        .json(response_success(rows, "Peticiones de reparación encontradas"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        response_error(500, "Error al obtener las peticiones de reparación")
      );
  }
};

export const insertarPeticionReparacion = async (req, res) => {
  try {
    const { descripcion, id_equipo, id_cliente, fecha_peticion } = req.body;

    if (!descripcion || !id_equipo || !id_cliente || !fecha_peticion) {
      return res
        .status(400)
        .json(response_bad_request("Todos los campos son obligatorios"));
    }

    const query = `
      INSERT INTO PeticionReparacion (descripcion, id_equipo, id_cliente, fecha_peticion)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db_pool_connection.query(query, [
      descripcion,
      id_equipo,
      id_cliente,
      fecha_peticion,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(201)
        .json(
          response_created(
            { id_peticion: result.insertId },
            "Petición de reparación creada con éxito"
          )
        );
    } else {
      res
        .status(500)
        .json(
          response_error(500, "No se pudo crear la petición de reparación")
        );
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al insertar la petición de reparación"));
  }
};

export const actualizarPeticionReparacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, id_equipo, fecha_peticion } = req.body;

    if (!descripcion || !id_equipo || !fecha_peticion) {
      return res
        .status(400)
        .json(response_bad_request("Todos los campos son obligatorios"));
    }

    const query = `
      UPDATE PeticionReparacion
      SET descripcion = ?, id_equipo = ?, fecha_peticion = ?
      WHERE id_peticion = ?
    `;
    const [result] = await db_pool_connection.query(query, [
      descripcion,
      id_equipo,
      fecha_peticion,
      id,
    ]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(
          response_success(null, "Petición de reparación actualizada con éxito")
        );
    } else {
      res
        .status(404)
        .json(
          response_not_found(
            `No se encontró la petición de reparación con ID ${id}`
          )
        );
    }
  } catch (error) {
    res
      .status(500)
      .json(
        response_error(500, "Error al actualizar la petición de reparación")
      );
  }
};

export const eliminarPeticionReparacion = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE PeticionReparacion
      SET estado = 0
      WHERE id_peticion = ?
    `;
    const [result] = await db_pool_connection.query(query, [id]);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json(
          response_success(null, "Petición de reparación eliminada con éxito")
        );
    } else {
      res
        .status(404)
        .json(
          response_not_found(
            `No se encontró la petición de reparación con ID ${id}`
          )
        );
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al eliminar la petición de reparación"));
  }
};
