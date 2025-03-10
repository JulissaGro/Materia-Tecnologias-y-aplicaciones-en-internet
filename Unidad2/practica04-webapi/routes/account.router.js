/**
* Por motivos de seguridad, el password se debe guardar cifrado,
*  por lo que se requiere utilizar un algoritmo de cifrado,
*  para este caso en BCrypt (instalar el paquete: npm install bcrypt)
*  con un work factor (o salt rounds) de 12.
*/

const express = require("express");
const app = express();
const router = express.Router();
const AccountService = require("../services/AccountService");
//Cors para peticiones
const cors = require("cors");
//BCrypt para cifrado
const bcrypt = require('bcrypt');
const saltRounds = 12;

//middleware que deja responder peticiones
app.use(cors());
app.use(express.json());
/**
* bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
*  Store hash in your password DB.
* });
*/

//Cifrar contraseña
async function cifrarContrasena(password) {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (err) {
        throw new Error('Error al cifrar la contraseña');  // Lanza un error si algo falla
    }
}

//Verificar la contraseña de verificación
async function verificarContrasena(passwordVerif, hash) {
    try {
        const result = await bcrypt.compare(passwordVerif, hash);
        return result;
    } catch (err) {
        throw new Error('Error al verificar la contraseña');
    }
}

async function validarDatos(usuario){
    try {
        const hashContra = await cifrarContrasena(usuario.password);
        usuario.password = hashContra;
        
        // Verificar si la contraseña de verificación coincide
        const contrasenaValida = await verificarContrasena(usuario.passwordVerif, hashContra);
        
        if (!contrasenaValida) {
            throw new Error("Las contraseñas no coinciden.");
        }
    } catch(err){
        throw err;
    }
}

//Endpoint para realizar el registro
router.post("/", async (req, res) =>{
    const accountService = new AccountService();
    const usuario = req.body;
    try{
        await validarDatos(usuario);
        const idUsuario = await accountService.registarUsuario(usuario);

        //Respuesta de que se guardó exitosamente
        res.status(201).json({message:"Usuario registrado exitosamente", idUsuario});
    } catch(err){
        //Reportar todos los fallos al usuario
        res.status(400).json({message:err.message || "Error desconocido en el registro"})
    }
});

module.exports = router;