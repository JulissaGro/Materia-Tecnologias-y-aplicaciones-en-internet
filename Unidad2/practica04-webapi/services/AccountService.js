const db = require("../dataAccess/db");

class AccountService {
  constructor() {}

  async verificarUsername(usuario) {
    const sql = "SELECT * FROM usuarios WHERE username=?";
    const p = [usuario.username];
    const [r] = await db.execute(sql, p);
    console.log("Resultado de la consulta:", r);

    if (r.length > 0) {
      throw new Error("Nombre de usuario ya en uso");
    }
  }

  //Registrar a un nuevo usuario (para router.account)
  async registarUsuario(usuario) {
    try {
      await this.verificarUsername(usuario);

      const sql =
        "INSERT INTO usuarios(`username`,`password`,`nombre`,`apellidos`,`tipo_usuario`) VALUES(?, ?, ?, ?, ?)";
      const p = [
        usuario.username,
        usuario.password,
        usuario.nombre,
        usuario.apellidos,
        "user",
      ];
      const [r] = await db.execute(sql, p);
      if (r.length <= 0) {
        throw new Error("Error al registrar usuario en la base de datos");
      }
      return r.insertId; //retornar el id para ver si se guardó
    } catch (err) {
      throw Error(err.message);
    }
  }
}

module.exports = AccountService;
