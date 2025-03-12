const express = require("express");
const {DateTime} = require("luxon");

const AccountService = require("../services/AccountService");
const auth = require("../middlewares/auth");

const router = express.Router();
const accountService = new AccountService();

router.post("/new-user", async (req, res) => {
    const r = await accountService.registerNewUser(req.body);
    res.json(r);
});

// Endpoint de login, para obtener el access token (JWT) y el refresh token
router.post("/login", async (req, res) => {
    
    // se obtienen el username y password del request object, y se validan
    const {username, password} = req.body;
    if (!username?.trim() || !password?.trim()) {
        res.status(400).json({message: "Se debe enviar el username y password"});
        return;
    }

    // Validación de las credenciales.
    const userId = await accountService.validateCredentials(username, password);
    if (!userId) {
        res.status(401).json({message: "Invalid credentials"});
        return;
    }

    // Generación de access token y el refresh token
    const accessToken = await accountService.createAccessToken(userId);
    const refreshToken = await accountService.createRefreshToken(userId);
    
    res.json({accessToken, refreshToken});
});

// Endpoint para obtener un nuevo access token usando el refresh token
router.post("/refresh-token", async (req, res) => {
    
    // Obtención del refresh token del request object
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({message: "Debe proporcionar el refresh token"});
        return;
    }

    // Se genera el nuevo access token
    const accessToken = await accountService.refreshAccessToken(refreshToken);
    if (!accessToken) {  
        res.status(401).json({message: "Refresh Token no válido o expirado"});
        return;
    }

    res.json({accessToken});
});

// Endpoint para obtener la información del usuario
router.get("/user-info", auth, (req, res) => {
    res.json(req.userData);
});

module.exports = router;
