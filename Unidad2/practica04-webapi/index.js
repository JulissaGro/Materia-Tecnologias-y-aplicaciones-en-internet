//Cada que hacemos un cambio hay que pararlo y volverlo a cargar
/**
 * Para usar bases de datos, en este caso mysql hay que instalar el siguiente
 *  paquete: npm i mysql2
 * 
 * Es posible hacer algo parecido, instalaremos una dependencia
 *  npm i nodemon -D
 *  -D porque es un paquete de desarrollo, no lo necesita la aplicación
 *  pero es necesario para nosotros en el desarrollo
 * Aparecerá en el package.json ahora solo hay que añadir al script lo siguiente:
 *  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
    },
 *  Ahora ya podemos ejecutar el comando npm run dev
 *  Nodemone se encargará de reiniciar el servicio automáticamente al guardar
 * 
 * Hay que instalar un paquete para la autentificación de usuarios
 *  npm i express-basic-auth
*/
const express = require("express");
//Base de datos(Ya no se necesita con el pool)
//const mysql = require("mysql2/promise");
//Servicio para la conexión a base de datos y retorno de todas las tareas
//const tareasService = require("./services/TareasService.js");
const cors = require("cors");

const routerApi = require("./routes");//No le ponemos "/index" porque ya lo supone
//No necesario por el pool
//const TareasService = require("./services/TareasService.js");
const app = express();
const PORT = 3001;
const requestLogger = require("./middlewares/requestLogger");
const auth = require("./middlewares/auth");

/**
 * El orden en que se ejecute el app.use es el orden en que se ejecutan
 *  los middlewares 
 * Manejar el request a lo largo de un pipeline
 */
app.use(express.json())

app.use(cors()); // Middleware que permite realizar llamadas ajax en otro dominio donde no se está ejecutando la api
app.use(express.json()); // Middleware para parsear el body de las peticiones

//Creación de un middelware
//Los middlewares los agregamos en una carpeta
app.use((req, res, next) =>{
    //Proceso de autentificación y envia el usuario
    console.log("Middelware para autenticación");
    req.username = "usuario_x"
    next(); //Ir al siguiente middelware o handler del endpoint
});

app.use(requestLogger);

//Rutas en las que se usarála autenticación
//app.use("/", auth);
//app.use("/json", auth);

app.use((req, res, next)=>{
    //Esta sería la lógica básica para enviar un statusCode en caso de
        //fallo, manejando todo en un único middleware final
    try {
        next();
    } catch (err) {
        res.status(500).json({message:"error"});        
    }
    console.log("Este middleware se debería ejecutar al último");
    
});

app.get("/", (req, res) =>{
    console.log("Ejecutando el handling del roop de la app");
    res.send("Hola desde Express");
});

//Esta petición la serializa en json
app.get("/json", (req, res)=>{
    const resObj = {
        id:1234,
        nombre:"Nombre del objeto",
        descripcion:"Descripción del objeto"
    }
    res.json(resObj);
});

//Prueba para verificar el endpoint (No necesario con el pool)
/* app.get("/test-db", async (req, res) =>{
    try{
        //Objeto de tipo conexión
        //Crea la conexión a partir de los parámetros que pusimos en dbConfig
        const db = await mysql.createConnection(dbConfig);
        res.send("Conexión a base de datos exitosa");
        await db.end(); //Esperar a que la conexión termine
    }catch(ex){
        console.error(ex); //Ver la excepción en consola
        res.status(500).send("Error de base de datos" + ex.message);
    }
}); */

//Pasado a otro lado por el pool
//Otro endpoint que regresa todos los registros de tareas
//Preferentemente no tener la conexión a la base de datos en los endpoints
//app.get("/tareas", async (req, res) =>{
    /**Por eso no ponemos esto aquí
     *const db = await mysql.createConnection(dbConfig);
     *--Nos regresa tanto rows como metadata, por lo que le indicamos
     *-- que solo queremos obtener las rows.
     *const [rows] = await db.execute("SELECT * FROM tareas");
     *await db.end();
     *res.json(rows);
    */

    //Solo llamamos al servicio
    //const tareasService = new TareasService();
    //res.json(await tareasService.obtenerTodas());
//}); 

routerApi(app);

app.listen(PORT, () =>{
    console.log("Aplicación Express corriendo...");
});