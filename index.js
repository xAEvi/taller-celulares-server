import express from "express";
import { PORT, config_core } from "./src/config/config.js";
import routes from "./src/routes/routes.js";
import cors from "cors";

const app = express();

app.use(cors(config_core.application.cors.server));

app.use(express.json());

app.use(routes);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Ruta no es válida",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando por el puerto ${PORT}`);
});
