/**
 * Se puede modificar el objeto req en cualquier middleware,
 *  se puede terminar una petición si no cumple algún criterio,
 *  con un statusCode para decir qué es lo que sucedió.
 * Siempre usar next para que pase al siguiente middleware.
 *  puede ayudar a agregar headers a la ejecución, etc, etc, etc.
 */
module.exports = function(req, res, next){
    const user = req.username || "[Anónimo]";
    console.log(
        "El usuario %s pide la ruta %s",
        user, req.originalUrl
    );
    next();
    
};