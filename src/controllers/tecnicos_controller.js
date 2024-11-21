import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_created,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/response.js";

// Obtener todos los técnicos activos
export const seleccionarTecnicos = async (req, res) => {
  try {
    const query = `CALL seleccionarTecnicos();`;

    const [rows] = await db_pool_connection.query(query);

    if (rows.length === 0 || rows[0].length === 0) {
      return res
        .status(404)
        .json(response_not_found("No hay técnicos activos"));
    } else {
      res.status(200).json(response_success(rows, "Técnicos encontrados"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al buscar técnicos"));
  }
};

// Obtener técnico activo por ID
export const seleccionarTecnicoPorId = async (req, res) => {
  try {
    const id_tecnico = req.params.id;

    if (!id_tecnico) {
      return res
        .status(400)
        .json(response_bad_request("El ID del técnico es requerido"));
    }

    const query = `CALL seleccionarTecnicoPorId(?);`;

    const [rows] = await db_pool_connection.query(query, [id_tecnico]);

    console.log(rows);

    if (rows.length === 0 || rows[0].length === 0) {
      return res.status(404).json(response_not_found("Técnico no encontrado"));
    } else {
      res.status(200).json(response_success(rows, "Técnico encontrado"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al buscar técnico"));
  }
};

// Insertar un nuevo técnico
export const insertarTecnico = async (req, res) => {
  try {
    const { nombre, telefono, email, estado } = req.body;

    if (!nombre || !telefono || !email) {
      return res
        .status(400)
        .json(
          response_bad_request(
            "Todos los campos obligatorios deben ser completados"
          )
        );
    }

    const query = `CALL insertarTecnico(?, ?, ?, ?);`;

    const [result] = await db_pool_connection.query(query, [
      nombre,
      telefono,
      email,
      estado || 1,
    ]);

    res
      .status(201)
      .json(response_created(result.insertId, "Técnico creado correctamente"));
  } catch (error) {
    res.status(500).json(response_error(500, "Error al crear técnico"));
  }
};

// Actualizar un técnico existente
export const actualizarTecnico = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, telefono, email, estado } = req.body;

    if (!id) {
      return res.status(400).json(response_bad_request("El ID es requerido"));
    }

    const query = `CALL actualizarTecnico(?, ?, ?, ?, ?);`;

    const [result] = await db_pool_connection.query(query, [
      id,
      nombre,
      telefono,
      email,
      estado,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json(response_not_found("Técnico no encontrado"));
    } else {
      res
        .status(200)
        .json(response_success(result, "Técnico actualizado correctamente"));
    }
  } catch (error) {
    res.status(500).json(response_error(500, "Error al actualizar técnico"));
  }
};

// Eliminar (inactivar) un técnico
export const eliminarTecnico = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json(response_bad_request("El ID es requerido"));
    }

    const query = `CALL eliminarTecnico(?);`;

    const [result] = await db_pool_connection.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json(response_not_found("Técnico no encontrado"));
    }

    res
      .status(200)
      .json(response_success(null, "Técnico eliminado correctamente"));
  } catch (error) {
    res
      .status(500)
      .json(
        response_error(500, "Error al realizar el borrado lógico del técnico")
      );
  }
};
