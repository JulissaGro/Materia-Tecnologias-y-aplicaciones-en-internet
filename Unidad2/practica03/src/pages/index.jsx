import Bienvenido from "../assets/baileBienvenida.gif";

export default function index(){
    return(
        <>
            <h1>Inicio</h1>
            <p>Bienvenido :)</p>
            <img src={Bienvenido} id="welcome" alt="Imagen de perritos de bienvenida"/>
        </>
    );
}