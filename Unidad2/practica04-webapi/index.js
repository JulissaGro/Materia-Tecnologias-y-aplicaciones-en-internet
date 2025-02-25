//Cada que hacemos un cambio hay que pararlo y volverlo a cargar
/**
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
*/
const express = require("express");
const routerApi = require("./routes");//No le ponemos "/index" porque ya lo supone
const app = express();
const PORT = 3001;

app.use(express.json())

app.get("/", (req, res) =>{
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

routerApi(app);

app.listen(PORT, () =>{
    console.log("Aplicación Express corriendo...");
});