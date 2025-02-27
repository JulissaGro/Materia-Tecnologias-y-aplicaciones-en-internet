/**
 * No es la mejor forma de accesar a datos, existe cierta debilidad con
 *  esta arquitectura.
 * Creamos una conexión y la cerramos, no se hace de esa forma, sino que
 *  se procura utilizar la estructura de POOL.
 * 
 *  Es una estrucura a la que se le indica cuantos elementos hay disponibles
 *  y en base a ello se ve cómo se acomodan estos elementos. Por ejemplo
 *  el proceso de los bancos, cada que se desocupa una ventanilla pasa la
 *  siguiente persona, así acomodan los elementos. Ya tienes una conexión libre,
 *  entonces se ejecuta cierta consulta en esa dirección.
 * 
 * El POOL de conexiones ya está implementado
 * Ya no se necesitarían los imports
  */
//const mysql = require("mysql2/promise");
//const dbConfig = require("../dbConfig.json");

const db = require("../dataAccess/db"); //conexión con el POOL

/** 
 * Todas estas ejecuciones se ponen fuera de los endopints
 *  por si es que en algún momento se cambia por ejemplo de MySQL a MongoDB,
 *  simplemente por abstracción.
*/
class TareasService{
    constructor(){ }

    //pasamos la funcionalidad del endpoint aquí 
    async obtenerTodas(){
        //Ya no se creará la conexión el pool creará y reutilizará conexiones
        //const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute("SELECT * FROM tareas");
        //await db.end(); //Ir cerrando las conexiones puede crear un cuello de botella
        return rows;
    }
}

module.exports = TareasService;