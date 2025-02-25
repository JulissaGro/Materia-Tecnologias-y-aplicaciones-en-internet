// eslint-disable-next-line react/prop-types
export default function ItemComponent({ data }) {
  const btnAccion = () => {
    alert(`Hola desde item ${data.nombre}`);
  };
  
  <div>
    <h3>
      {data.nombre} (Id {data.id})
    </h3>
    <p>{data.descripcion}</p>
  </div>;

  return new Promise((resolve) => {
    setTimeout(() => resolve(d), 2000);
  });
}
