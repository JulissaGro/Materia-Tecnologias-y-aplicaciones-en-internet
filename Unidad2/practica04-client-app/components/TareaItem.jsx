export default function TareaItem({tarea}){
    return (
      <div>
        <h3>{tarea.descripcion}</h3>
        <span>Caduca: <strong>{tarea.fechaCaduca || "[SIN CADUCIDAD]"}</strong></span>
      </div>
    );
  }