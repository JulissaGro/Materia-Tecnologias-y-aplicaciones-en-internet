const express = require("express");
const elementosRouter = require("./elementos.router");
const productosRouter = require("./productos.router");
const tareasRouter = require("./tareas.router");
const accounRouter = require("./account.router");

//Normalmente las rutas se agrupan según cierto contexto
function routerApi(app) {
    //Ruta de cierto conjunto común de rutas
    const router = express.Router();
    /**
     * Por buenas prácticas normalmente se versiona la API
     *  Por ejemplo aquí se pondrá v1 
     * A partir de ahí podemos poner varias rutas usando
     *  router
     */
    app.use("/api/v1/", router); //Para definir un middleware

    router.use("/elementos", elementosRouter);
    router.use("/productos", productosRouter);
    router.use("/tareas", tareasRouter);
    router.use("/account", accounRouter);
}

//Exportamos routerApi
module.exports = routerApi; //Lo que recibirá el index principal