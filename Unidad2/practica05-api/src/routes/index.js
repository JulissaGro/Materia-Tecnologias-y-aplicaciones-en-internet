const express = require("express");

const accountRouter = require("./accountRouter");

/**
 * Función principal para registrar las rutas de la aplicación
 * @param {*} app Express App
 */
function routerApi(app) {
    const router = express.Router();
    app.use("/api/v1/", router);
    router.use("/account", accountRouter);
}

module.exports = routerApi;
