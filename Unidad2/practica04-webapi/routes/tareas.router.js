//Nueva sección para el endpoint obtener todas las tareas
const express = require("express");
const router = express.Router();
const TareasService = require("../services/TareasService");

router.get("/", async (req, res)=>{
    const tareasService = new TareasService();
    res.json(await tareasService.obtenerTodas());
});


//TODO: endpoint para guardar una tarea nueva
module.exports = router;