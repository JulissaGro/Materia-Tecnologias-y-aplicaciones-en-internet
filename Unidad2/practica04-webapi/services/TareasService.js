const mysql = require("mysql2/promise");
const dbConfig = require("../dbConfig.json");

/** 
 * Todas estas ejecuciones se ponen fuera de los endopints
 *  por si es que en algún momento se cambia por ejemplo de MySQL a MongoDB,
 *  simplemente por abstracción.
*/
class TareasService{
    constructor(){ }

    //pasamos la funcionalidad del endpoint aquí 
    async obtenerTodas(){
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute("SELECT * FROM tareas");
        await db.end();
        return rows;
    }
}

module.exports = TareasService;