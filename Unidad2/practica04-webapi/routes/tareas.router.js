//Nueva sección para el endpoint obtener todas las tareas
const express = require("express");
const router = express.Router();
const TareasService = require("../services/TareasService");

router.get("/", async (req, res)=>{
    const tareasService = new TareasService();
    res.json(await tareasService.obtenerTodas());
});

/**
 * Tratar de no contaminar los endpoints con acceso a datos,
 *  para eso existen los servicios y los repositorios. 
 */
//Endpoint para guardar una tarea nueva
router.post("/", async (req, res) =>{
    const tareasService = new TareasService();
    const tarea = req.body;
    //TODO: Validar datos de la tarea
    /**
     * Siempre hay que enviar una respuesta, de otro modo la ejecución
     *  quedará colgada pa siempre. Para que anden atentos.
    */
    const idTarea = await tareasService.guardarNuevaTarea(tarea);
    res.status(201).json({message:"Tarea creada exitosamente :))))", idTarea});

});
module.exports = router;