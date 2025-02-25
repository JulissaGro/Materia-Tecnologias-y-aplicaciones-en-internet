//Es más cosa de darle orden a la api el nombrarlo de esta manera
//Esta está dirijida a productos.

const express = require("express");
const router = express.Router();

const productos = [
    {id: 1, nombre: "Producto 1"},
    {id: 2, nombre: "Producto 2"},
    {id: 3, nombre: "Producto 3"},
    {id: 4, nombre: "Producto 4"},
    {id: 5, nombre: "Producto 5"},
    {id: 6, nombre: "Producto 6"},
];

/**
 * Mostrar el listado de productos
 * Estos datos pueden venir de una base de datos o del caché,
 *  en este caso con fines demostrativos tenemos nuestro propia
 *  lista aquí
 */
router.get("/", (req, res) => {
    /**
     * Las buenas prácticas del diseño de API nos dicen que no es
     *  buena idea regreasr un array con todos los elementos.
     * 
     * Si se regresa simplemente un array, no puedes literal regresar más
     *  cosas si las llegas a necesitar, es por ello que se usan objetos.
     *  Para expandir la funcionalidad de los "endpoints", cuando se diseña
     *  un backend hay que considerar muchas cosas.
     */
    const resObj ={
        message: "Listado de productos obtenido exitosamente",
        data: productos,
    };

    res.json(resObj); //respuesta json
});

module.exports = router;