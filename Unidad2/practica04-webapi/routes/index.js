const express = require("express");
const elementosRouter = require("./elementos.router");
const productosRouter = require("./productos.router");

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
}

//Exportamos routerApi
module.exports = routerApi; //Lo que recibirá el index principal