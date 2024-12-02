import { Router } from "express";
import {
  seleccionarClientes,
  seleccionarClientesPorID,
  insertarCliente,
  actualizarCliente,
  eliminarCliente,
} from "../controllers/clientes_controller.js";

import {
  seleccionarUsuarioPorID,
  seleccionarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/usuarios_controller.js";

import {
  seleccionarTecnicos,
  seleccionarTecnicoPorID,
  insertarTecnico,
  actualizarTecnico,
  eliminarTecnico,
} from "../controllers/tecnicos_controller.js";

import {
  seleccionarPeticionesReparacion,
  seleccionarPeticionReparacionPorID,
  seleccionarPeticionesReparacionPorCliente,
  insertarPeticionReparacion,
  actualizarPeticionReparacion,
  eliminarPeticionReparacion,
} from "../controllers/peticiones_controller.js";

import {
  seleccionarRepuestos,
  seleccionarRepuestoPorID,
  insertarRepuesto,
  actualizarRepuesto,
  eliminarRepuesto,
} from "../controllers/repuestos_controller.js";

import {
  seleccionarReparacion,
  seleccionarReparacionPorID,
  seleccionarReparacionPorCliente,
  insertarReparacion,
  actualizarReparacion,
  eliminarReparacion,
} from "../controllers/reparaciones_controller.js";

import {
  seleccionarReparacionRepuesto,
  insertarReparacionRepuesto,
  eliminarReparacionRepuesto,
  actualizarReparacionRepuesto,
} from "../controllers/reparacion_repuesto_controller.js";

const routes = Router();

// Clientes
routes.get("/clientes", seleccionarClientes);
routes.get("/clientes/:id", seleccionarClientesPorID);
routes.post("/clientes", insertarCliente);
routes.put("/clientes/:id", actualizarCliente);
routes.delete("/clientes/:id", eliminarCliente);

// Usuarios
routes.get("/usuarios", seleccionarUsuarios);
routes.get("/usuarios/:id", seleccionarUsuarioPorID);
routes.put("/usuarios/:id", actualizarUsuario);
routes.delete("/usuarios/:id", eliminarUsuario);

// Técnicos
routes.get("/tecnicos", seleccionarTecnicos);
routes.get("/tecnicos/:id", seleccionarTecnicoPorID);
routes.post("/tecnicos", insertarTecnico);
routes.put("/tecnicos/:id", actualizarTecnico);
routes.delete("/tecnicos/:id", eliminarTecnico);

// Peticiones
routes.get("/peticiones", seleccionarPeticionesReparacion);
routes.get("/peticiones/:id", seleccionarPeticionReparacionPorID);
routes.get(
  "/peticiones/cliente/:id_cliente",
  seleccionarPeticionesReparacionPorCliente
);
routes.post("/peticiones", insertarPeticionReparacion);
routes.put("/peticiones/:id", actualizarPeticionReparacion);
routes.delete("/peticiones/:id", eliminarPeticionReparacion);

// Repuestos
routes.get("/repuestos", seleccionarRepuestos);
routes.get("/repuestos/:id", seleccionarRepuestoPorID);
routes.post("/repuestos", insertarRepuesto);
routes.put("/repuestos/:id", actualizarRepuesto);
routes.delete("/repuestos/:id", eliminarRepuesto);

// Reparaciones
routes.get("/reparaciones", seleccionarReparacion);
routes.get("/reparaciones/:id", seleccionarReparacionPorID);
routes.get(
  "/reparaciones/cliente/:id_cliente",
  seleccionarReparacionPorCliente
);
routes.post("/reparaciones", insertarReparacion);
routes.put("/reparaciones/:id", actualizarReparacion);
routes.delete("/reparaciones/:id", eliminarReparacion);

// Reparaciones Repuestos
routes.get("/reparaciones_repuestos/:id", seleccionarReparacionRepuesto);
routes.post("/reparaciones_repuestos", insertarReparacionRepuesto);
routes.put("/reparaciones_repuestos/", actualizarReparacionRepuesto);
routes.delete("/reparaciones_repuestos/:id", eliminarReparacionRepuesto);

export default routes;
