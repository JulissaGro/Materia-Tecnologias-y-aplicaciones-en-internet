const basicAuth = require("express-basic-auth");
const db = require("../dataAccess/db");

function authorizer(username, password, cbRes) {
  if(!username.trim()){ //no ingresa usuario
    cbRes(null, false);
    return;
  }
  const sql = "SELECT * FROM usuarios WHERE username = ?";
  //Forma antigua porque parece que no acepta funciones asíncronas
  db.query(sql, [username]) //Regresa una promesa

    .then((dbRes) => {
      const [rows] = dbRes;
      console.log(rows);
      if (rows.length == 0) {
        //Si no regresa registros
        //Callback regresa error y estado de la autentificación
        cbRes(null, false);
      }
      const usuario = rows[0];
      const loginCorrecto = usuario.password == password;
      cbRes(null, loginCorrecto);
    });
}

const auth = basicAuth({ 
    //Regresa un middleware para implementar en los endpoints
    // en los que se quiera una autenticación
    authorizer: authorizer,
    authorizeAsync: true,
    challenge: true,
    realm: "Auth required!!!"
});

module.exports = auth;