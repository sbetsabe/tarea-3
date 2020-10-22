import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {

  const baseUrl="http://localhost:8080/apiFrameworks/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const peticionesGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      /*console.log(response.data);*/
      setData(response.data);
    })
  }

  useEffect(()=>{
    peticionesGet();
  },[])

  return (
    <div className="container">
      <button className="btn btn-success"  onClick={()=>abrirCerrarModalInsertar()} >Insertar</button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(framework=>(
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>{framework.nombre}</td>
              <td>{framework.lanzamiento}</td>
              <td>{framework.desarrollador}</td>
              <td>
                <button className="btn btn-primary">Editar</button>
                <button className="btn btn-danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Framework</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre:</label>
            <br/>
            <input type="text" className="form-control"/>
            <br/>
            <label>Lanzamiento:</label>
            <br/>
            <input type="text" className="form-control"/>
            <br/>
            <label>Desarrollador:</label>
            <br/>
            <input type="text" className="form-control"/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary">Insertar</button>
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
