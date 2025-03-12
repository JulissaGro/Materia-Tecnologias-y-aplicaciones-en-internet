const AccountService = require("../services/AccountService");
const accountService = new AccountService();

/**
 * Middleware para autenticar, para proteger endpoints que necesiten el contexto del usuario
 */
async function authenticateUser(req, res, next) {

    // se verifica que se haya enviado el access token en el header del request
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({message: "JWT no proporcionado"});
        return;
    }   

    // Del token obtenemos los datos del usuario.
    const token = authHeader.split(" ")[1];
    const userData = await accountService.getUserDataFromAccessToken(token);
    if (!userData) {  // si no hay datos, ha expirado el token o no es válido
        res.status(401).json({message: "Token no válido o expirado"});
        return;
    }

    // para tener en los siguientes endpoints los datos del usuario
    req.userData = userData;  
    
    next();  // Exec del siguiente middleware
}

module.exports = authenticateUser;
