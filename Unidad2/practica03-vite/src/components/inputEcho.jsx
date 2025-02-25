import {useState} from "react";

// eslint-disable-next-line react/prop-types
function InputEcho({textoActualizado, titulo}) {

  const [texto, setTexto] = useState('');

  const inputChanged = v => {
    setTexto(v);
    textoActualizado(v);
  }

  return (
    <div>
      <h2>{ titulo }</h2>
      <table>
        <tbody>
          <tr>
            <td><label>Ingrese un texto:</label></td>
            <td><input type="text" value={ texto } onChange={e => inputChanged(e.target.value) } /></td>
          </tr>
          <tr>
            <td colSpan="2">
              <strong>{ texto }</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default InputEcho;