import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

export const seleccionarRepuestos = async (req, res) => {
  try {
    const query = "CALL seleccionarRepuestos();";

    const [rows] = await db_pool_connection.query(query);

    if (rows[0].length === 0) {
      return res
        .status(404)
        .json(response_not_found("No se encontraron repuestos activos"));
    } else {
      res.status(200).json(response_success(rows[0], "Repuestos encontrados"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener repuestos"));
  }
};

export const seleccionarRepuestoPorId = async (req, res) => {
  try {
    const id_repuesto = req.params.id_repuesto;

    if (!id_repuesto) {
      return res
        .status(400)
        .json(response_bad_request("El ID del repuesto es requerido"));
    }

    const query = "CALL seleccionarRepuestoPorId(?);";

    const [rows] = await db_pool_connection.query(query, [id_repuesto]);

    if (rows[0].length === 0) {
      return res.status(404).json(response_not_found("Repuesto no encontrado"));
    } else {
      res.status(200).json(response_success(rows[0], "Repuesto encontrado"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al obtener el repuesto"));
  }
};

export const insertarRepuesto = async (req, res) => {
  try {
    const { nombre, cantidad, precio } = req.body;

    if (!nombre || !cantidad || !precio) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "Todos los campos obligatorios deben ser completados"
          )
        );
    }

    const query = "CALL insertarRepuesto(?, ?, ?);";

    const [result] = await db_pool_connection.query(query, [
      nombre,
      cantidad,
      precio,
    ]);

    res
      .status(201)
      .json(response_created(result.insertId, "Repuesto creado correctamente"));
  } catch (error) {
    res.status(500).json(response_error(500, "Error al crear el repuesto"));
  }
};

export const actualizarRepuesto = async (req, res) => {
  try {
    const id_repuesto = req.params.id_repuesto;
    const { nombre, cantidad, precio } = req.body;

    if (!id_repuesto) {
      return res
        .status(400)
        .json(response_bad_request("El ID del repuesto es requerido"));
    }

    const query = "CALL actualizarRepuesto(?, ?, ?, ?);";

    const [result] = await db_pool_connection.query(query, [
      id_repuesto,
      nombre,
      cantidad,
      precio,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json(response_not_found("Repuesto no encontrado"));
    }

    res
      .status(200)
      .json(response_success(result, "Repuesto actualizado correctamente"));
  } catch (error) {
    res
      .status(500)
      .json(response_error(500, "Error al actualizar el repuesto"));
  }
};

export const eliminarRepuesto = async (req, res) => {
  try {
    const id_repuesto = req.params.id_repuesto;

    if (!id_repuesto) {
      return res
        .status(400)
        .json(response_bad_request("El ID del repuesto es requerido"));
    }

    const query = "CALL eliminarRepuesto(?);";

    const [result] = await db_pool_connection.query(query, [id_repuesto]);

    if (result.affectedRows === 0) {
      return res.status(404).json(response_not_found("Repuesto no encontrado"));
    }

    res
      .status(200)
      .json(response_success(null, "Repuesto eliminado correctamente"));
  } catch (error) {
    res.status(500).json(response_error(500, "Error al eliminar el repuesto"));
  }
};
