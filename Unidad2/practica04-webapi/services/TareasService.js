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
class TareasService {
  constructor() {}

  //pasamos la funcionalidad del endpoint aquí
  async obtenerTodas() {
    //Ya no se creará la conexión el pool creará y reutilizará conexiones
    //const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute("SELECT * FROM tareas");
    //await db.end(); //Ir cerrando las conexiones puede crear un cuello de botella
    /**
     * Haremos el cambio a retornar con map, para poder manipular los datos a nuestro
     *  gusto y no dejarlos como lo retorna la base de datos.
     */
    return rows.map((r) => {
      //El signo de interrogación(?) es un protector de NULL
      //Si encuentra null no seguirá con el proceso y saltará al siguiente
      return {
        id: r.id,
        descripcion: r.descripcion,
        fechaRegistro: r.fecha_registro.toLocaleString("es-MX"),
        fechaCaduca: r.fecha_caduca?.toLocaleString("es-MX"), // el ? significa que si es null, no se ejecuta lo que sigue
        concluido: r.concluido != 0,
      };
    });
  }

  //Guardar tareas (usada en el router.tareas)
  async guardarNuevaTarea(tarea) {
    const sql =
      "INSERT INTO tareas (descripcion, fecha_registro, fecha_caduca, concluido) VALUES (?, ?, ?, ?)";

    const p = [tarea.descripcion, tarea.fechaRegistro, tarea.fechaCaduca, 0];
    const [r] = await db.execute(sql, p);
    return r.insertId; //Como es un autoincrement podemos obtener el id del INSERT
  }
}

module.exports = TareasService;