import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

// Obtener todas las peticiones activas
export const seleccionarPeticiones = async (req, res) => {
  try {
    const query = `CALL seleccionarPeticiones();`;

    const [rows] = await db_pool_connection.query(query);

    if (rows[0].length === 0) {
      return res
        .status(404)
        .json(response_not_found("No hay peticiones de reparación activas"));
    } else {
      res.status(200).json(response_success(rows, "Peticiones encontradas"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al buscar peticiones"));
  }
};

// Obtener una petición activa por ID
export const seleccionarPeticionPorId = async (req, res) => {
  try {
    const id_peticion = req.params.id;

    if (!id_peticion) {
      return res
        .status(400)
        .json(response_bad_request("El ID de la petición es requerido"));
    }

    const query = `CALL seleccionarPeticionPorId(?);`;

    const [rows] = await db_pool_connection.query(query, [id_peticion]);

    if (rows[0].length === 0) {
      return res
        .status(404)
        .json(
          response_not_found(
            "No se encontró ninguna petición activa con ese ID"
          )
        );
    } else {
      res.status(200).json(response_success(rows, "Petición encontrada"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al buscar la petición"));
  }
};

// Obtener peticiones activas por cliente
export const seleccionarPeticionesByClienteId = async (req, res) => {
  try {
    const id_cliente = req.params.id_cliente;

    if (!id_cliente) {
      return res
        .status(400)
        .json(response_bad_request("El ID del cliente es requerido"));
    }

    const query = `CALL seleccionarPeticionesByClienteId(?);`;

    const [rows] = await db_pool_connection.query(query, [id_cliente]);

    if (rows[0].length === 0) {
      return res
        .status(404)
        .json(
          response_not_found(
            "No se encontraron peticiones activas para este cliente"
          )
        );
    } else {
      res.status(200).json(response_success(rows, "Peticiones encontradas"));
    }
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al buscar peticiones por cliente"));
  }
};

// Insertar una nueva petición
export const insertarPeticion = async (req, res) => {
  try {
    const { descripcion, id_equipo, id_cliente, fecha_peticion, estado } =
      req.body;

    if (!descripcion || !id_equipo || !id_cliente || !fecha_peticion) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "Todos los campos obligatorios deben ser completados"
          )
        );
    }

    const query = `CALL insertarPeticion(?, ?, ?, ?, ?);`;

    const [result] = await db_pool_connection.query(query, [
      descripcion,
      id_equipo,
      id_cliente,
      fecha_peticion,
      estado || 1,
    ]);

    res
      .status(201)
      .json(response_created(result.insertId, "Petición creada correctamente"));
  } catch (error) {
    res.status(500).json(response_error(500, "Error al crear petición"));
  }
};

// Actualizar una petición existente
export const actualizarPeticion = async (req, res) => {
  try {
    const id = req.params.id;
    const { descripcion, id_equipo, id_cliente, fecha_peticion, estado } =
      req.body;

    if (!id) {
      return res.status(400).json(response_bad_request("El ID es requerido"));
    }

    const query = `CALL actualizarPeticion(?, ?, ?, ?, ?, ?);`;

    const [result] = await db_pool_connection.query(query, [
      id,
      descripcion,
      id_equipo,
      id_cliente,
      fecha_peticion,
      estado,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json(response_not_found("Petición no encontrada"));
    } else {
      res
        .status(200)
        .json(response_success(result, "Petición actualizada correctamente"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al actualizar petición"));
  }
};

// Eliminar (inactivar) una petición
export const eliminarPeticion = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json(response_bad_request("El ID es requerido"));
    }

    const query = `CALL eliminarPeticion(?);`;

    const [result] = await db_pool_connection.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json(response_not_found("Petición no encontrada"));
    }

    res
      .status(200)
      .json(response_success(null, "Petición eliminada correctamente"));
  } catch (error) {
    res
      .status(500)
      .json(
        response_error(
          500,
          "Error al realizar el borrado lógico de la petición"
        )
      );
  }
};
