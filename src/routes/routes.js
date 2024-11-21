import { Router } from "express";
import {
  seleccionarPeticiones,
  insertarPeticion,
  actualizarPeticion,
  seleccionarPeticionesByClienteId,
  seleccionarPeticionPorId,
  eliminarPeticion,
} from "../controllers/peticiones_controller.js";

import {
  seleccionarTecnicos,
  seleccionarTecnicoPorId,
  insertarTecnico,
  actualizarTecnico,
  eliminarTecnico,
} from "../controllers/tecnicos_controller.js";

const routes = new Router();

// Peticiones

routes.get("/peticiones", seleccionarPeticiones);
routes.get("/peticiones/cliente/:id_cliente", seleccionarPeticionesByClienteId);
routes.post("/peticiones", insertarPeticion);
routes.put("/peticiones/:id", actualizarPeticion);
routes.delete("/peticiones/:id", eliminarPeticion);
routes.get("/peticiones/:id", seleccionarPeticionPorId);

// Técnicos

routes.get("/tecnicos", seleccionarTecnicos);
routes.get("/tecnicos/:id", seleccionarTecnicoPorId);
routes.post("/tecnicos", insertarTecnico);
routes.put("/tecnicos/:id", actualizarTecnico);
routes.delete("/tecnicos/:id", eliminarTecnico);

export default routes;
