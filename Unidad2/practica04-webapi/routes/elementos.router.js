/**
 * Definir un conjunto específico de rutas, normalmente se definen
 *  en relación a operaciones CRUD.
 * 
 * Es la forma más vieja de importar modulos o paquetes require(),
 *  por así decir la forma legacy, pero aún se usa.
 * La forma nueva es aquella que se usó en react:
 *  import nombre from "ruta";
 * Como node es más viejo, usa esta forma de importar.
 */
const express = require("express");
const router = express.Router();

//Trabajaremos con ciertos prefijos, no hay necesidad de poner el prefijo "elementos"
router.get("/:id", (req, res) => {
    //Obtendrá la propiedad id y la pondrá en una constante llamada igual "id"
    // son características de javascript (objectDeconstructor)
    const {id} = req.params;
    const resObj = {
        //Si tenemos el mismo nombre de propiedad con el mismo nombre de la variable
        // a asignar se puede simplemente poner la propiedad
        id,
        nombre: `Elemento ${id}`,
        descripcion: `Descripción del elemento ${id}`
    };
    res.json(resObj);
});

//Por buenas prácticas no se debe mandar el payload en las peticiones get
//  por lo que se usa como alternativa post, put y patch
router.post("", (req, res) =>{
    /**
     * Formato json porque es la serialización más utilizada
     * Express deserializa el json que se encuentra en el body para obtener
     * un objeto de javascript en este caso resObj
    */
    const reqObj = req.body;

    const resObj = {
        message: "Elemento guardado correctamente",
        data: reqObj,
    }

    res.json(resObj);
});

/**
 * En vez del export default ponemos module.exports indicando 
 *  lo que queremos exportar.
*/
 //Forma de exportar elementos
 module.exports = router;