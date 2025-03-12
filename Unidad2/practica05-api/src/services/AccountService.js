const bcrypt = require("bcrypt"); //Cifrado de contraseñas
const jwt = require("jsonwebtoken"); //Manejar JWT
const Ulid = require("ulid"); //Identificadores para el refresh token
const {DateTime} = require("luxon"); //Manejo de fechas

const config = require("../config.json").accountServiceConfig;
const db = require("../data-access/db");

/**
 * Representa los datos básicos de un usuario.
 * @typedef {Object} UserData
 * @property {number} id Identificador del usuario
 * @property {string} nombre Nombre del usuario
 * @property {string} apellidos Apellidos del usuario (puede ser null)
 * @property {string} tipoUsuario Tipo de usuario
 * @property {number} activo Un 0 si el usuario ya fue eliminado, de otra forma 1
 */

/**
 * Representa los datos del nuevo usuario a registrar
 * @typedef {Object} RegisterNewUserReq 
 * @property {string} username El username
 * @property {string} password El password del nuevo usuario en texto plano
 * @property {string} nombre El nombre del usuario.
 * @property {string} apellidos Los apellidos del nuevo usuario a registrar
 */

/**
 * Representa la respuesta dela operación de registrar un nuevo usuario
 * @typedef {Object} RegisterNewUserRes
 * @property {string[]} errors Errores de la operación
 * @property {number} userId El identificador del usuario registrado, 0 si errores.
 */

/**
 * Implementa la funcionalidad correspondiente a la cuenta del usuario: 
 * validar credenciales, generar token de autenticación, generar refresh tokens
 * para la autenticación...
 */
class AccountService {

    constructor() {
        this._accessTokenSecret = config.accessTokenSecret;
        this._accessTokenExpirationSec = config.accessTokenExpirationSec;
        this._refreshTokenExpirationDays = config.refreshTokenExpirationDays;
        this._passwordSaltWorkFactor = config.passwordSaltWorkFactor;
    }

    /**
     * Registra un nuevo usuario en DB
     * @param {RegisterNewUserReq} newUser Los datos del nuevo usuario a registrar
     * @returns {RegisterNewUserRes}
     */
    async registerNewUser(newUser) {
        
        // Validaciones de que los datos necesarios esten establecidos
        const errors = [];
        if (!newUser.username?.trim()) {
            errors.push("Se debe especificar el username");
        }
        if (!newUser.password?.trim()) {
            errors.push("Se debe especificar el password");
        }
        if (!newUser.nombre?.trim()) {
            errors.push("Se debe especificar el nombre");
        }

        if (errors.length) {
            return {errors, userId: 0};
        }

        const apellidos = newUser.apellidos?.trim() ? newUser.apellidos.trim() : null;
        const username = newUser.username.trim();

        // El password en DB va cifrado
        const password = await bcrypt.hash(newUser.password, this._passwordSaltWorkFactor);

        // Validación - existe el usuario con el username especificado?
        let sql = "SELECT COUNT(*) c FROM usuarios WHERE username = ?";
        const [rExiste] = await db.query(sql, [username]);
        if (rExiste[0].c) {
            errors.push(`Ya existe usuario con username ${username}`);
            return {errors, userId: 0};
        }

        // Insert del nuevo usuario en DB
        sql = 
            "INSERT INTO usuarios " +
            "  (username, password, nombre, apellidos, tipo_usuario, activo)" +
            "  VALUES (?, ?, ?, ?, ?, ?)"
        let p = [username, password, newUser.nombre.trim(), apellidos, "user", 1];
        const [rInsert] = await db.execute(sql, p);
        
        return {errors, userId: rInsert.insertId};
    }

    /**
     * Para verificar si las credenciales (username y password) son correctas, regresando el
     * identificador del usuario.
     * @param {String} username El username del usuario a validar.
     * @param {String} password El password en texto plano
     * @returns {Promise<Number>} El identificador del usuario, 
     * 0 si la autenticación no fue correcta
     */
    async validateCredentials(username, password) {
        
        // Consulta de los datos para hacer la autenticación del usuario
        const sql = 
                "SELECT id, username, password FROM usuarios" +
                "  WHERE username = ? AND activo = 1";
        const [r] = await db.query(sql, [username]);
        if (!r.length) return 0;  // No existe el usuario o fue eliminado

        // Se compara la contraseña, si se correcta se regresa el id del usuario, si no 0
        return await bcrypt.compare(password, r[0].password) ? r[0].id : 0;
    }

    /**
     * Obtiene los datos del usuario por el username especificado.
     * @param {string} username username del usuario a obtener los datos
     * @returns {Promise<UserData>}
     */
    async getUserData(username) {
        const sql = 
            "SELECT id, username, nombre, apellidos, tipo_usuario tipoUsuario, activo" +
            "  FROM usuarios WHERE username = ?";
        const [r] = await db.query(sql, [username]);
        return r.length ? r[0] : null;
    }

    /**
     * Obtiene los datos del usuario por su identificador.
     * @param {number} userId Identificador del usuario a obtebner los datos.
     * @returns {Promise<UserData>}
     */
    async getUserDataByUserId(userId) {
        const sql = 
            "SELECT id, username, nombre, apellidos, tipo_usuario tipoUsuario, activo" +
            "  FROM usuarios WHERE id = ?";
        const [r] = await db.query(sql, [userId]);
        return r.length ? r[0] : null;
    }

    /**
     * Crea un nuevo access token
     * @param {Number} userId username del usuario del cual se quiere crear un token.
     * @returns {Promise<string>} Token de acceso o null si no se pudo generar (no existe el usuario)
     */
    async createAccessToken(userId) {

        const userData = await this.getUserDataByUserId(userId);
        if (!userData) return null;  // No existe el usuario, null return

        // El cálculo de cuando expira el token se hace sumando los segundos que dura el
        // token a la fecha-hora actual (epoch ? Unix time)
        const exp = DateTime.now().plus({second: this._accessTokenExpirationSec});
        const tokenData = {
            userId: userData.id,
            username: userData.username,
            // Se pudieran agregar más datos del usuario al token, pero hay que tener
            // cuidado que no sean datos sensibles, porque el token se puede decodificar
            exp: Math.floor(exp.toSeconds())  // expiración en unix time (entero)
        };

        // Para generar el token, lo firmarmos con nuestra clave secreta.
        return jwt.sign(tokenData, this._accessTokenSecret);
    }

    /**
     * Crea un nuevo refresh token para un usuario específico.
     * @param {number} userId El username del usuario del cual se quiere crear 
     * el refresh token
     * @returns {Promise<string>} El refresh token, null si no existe el usuario.
     */
    async createRefreshToken(userId) {

        // Fecha hora actual e idenficador único de tipo ULID para el refresh token
        const now = DateTime.now();
        const refreshToken = Ulid.ulid();

        // El refresh token generado lo guardamos en DB
        const sql = 
            "INSERT INTO refresh_tokens" +
            "  (refresh_token, usuario_id, fecha_generado, fecha_caduca, activo)" +
            " VALUES (?, ?, ?, ?, ?)";
        const fechaGenerado = now.toJSDate();
        // El refresh token solo va a durar n cantidad de días que especificamos en la config
        const fechaCaduca = now.plus({days: this._refreshTokenExpirationDays}).toJSDate();
        const p = [refreshToken, userId, fechaGenerado, fechaCaduca, 1];
        await db.execute(sql, p);

        return refreshToken;  // success   :)
    }

    /**
     * Obtiene un nuevo access token a partr del refresh token
     * @param {string} refreshToken El refresh token con el cual vamos a obtener otro token
     * @returns {Promise<string>} El nuevo access token o null si no se genero (expirado refresh)
     */
    async refreshAccessToken(refreshToken) {

        const now = new Date().getTime();

        // Se obtiene el refresh token guardado en DB, para validarlo
        const sql = "SELECT * FROM refresh_tokens WHERE refresh_token = ? AND activo = 1";
        const [r] = await db.query(sql, [refreshToken]);
        if (!r.length) return null;  // No existe, se regresa null

        // validación de que el refresh token siga vigente
        const refreshTokenData = r[0];
        const fechaCaduca = refreshTokenData.fecha_caduca.getTime();
        if (now > fechaCaduca) {
            // se invalida el refresh token, porque ya expiró
            await this.invalidateRefreshToken(refreshToken);
            return null;
        }

        // Se genera un nuevo access token
        return await this.createAccessToken(refreshTokenData.usuario_id);
    }

    /**
     * Invalida un refresh token para que ya no pueda usarse.
     * @param {string} refreshToken El refresh token a invalidar
     */
    async invalidateRefreshToken(refreshToken) {
        const sql = "UPDATE refresh_tokens SET activo = 0 WHERE refresh_token = ?";
        await db.execute(sql, [refreshToken]); 
    }

    /**
     * Obtiene los datos del usuario según el access token
     * @param {string} accessToken El access token con el cual se quieren obtener los datos
     * @returns {Promise<UserData>}
     */
    async getUserDataFromAccessToken(accessToken) {
        if (!accessToken) return null;
        let data = null;
        try {
            data = jwt.verify(accessToken, this._accessTokenSecret);
        }
        catch (ex) {
            return null;
        }
        return await this.getUserDataByUserId(data.userId);
    }
}   

module.exports = AccountService;
