//Aquí se hará el POOL de conexiones
//Manejo de acceso a datos

const mysql = require("mysql2"); //Uso de paquete mysql2
const dbConfig = require("./dbConfig.json"); //Usar la conexión del archivo

const pool = mysql.createPool(dbConfig); //Inserta las configuraciones en el pool
const promisePool = pool.promise();


module.exports = promisePool;