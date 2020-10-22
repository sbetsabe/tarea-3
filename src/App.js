import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {

  const baseUrl="http://localhost:8080/apiFrameworks/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [personaSeleccionada, setPersonaSeleccionada]=useState({
    id: '',
    nombre: '',
    apellidos: '',
    email: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target
    setPersonaSeleccionada((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(personaSeleccionada);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const peticionesGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      /*console.log(response.data);*/
      setData(response.data);
    })
  }

  const peticionesPost=async()=>{
    var f = new FormData();
    f.append("nombre", personaSeleccionada.nombre);
    f.append("apellidos", personaSeleccionada.apellidos);
    f.append("email", personaSeleccionada.email);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      /*console.log(response.data);*/
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    })
  }

  const peticionesPut=async()=>{
    var f = new FormData();
    f.append("nombre", personaSeleccionada.nombre);
    f.append("apellidos", personaSeleccionada.apellidos);
    f.append("email", personaSeleccionada.email);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: personaSeleccionada.id}})
    .then(response=>{
      var dataNueva = data;
      dataNueva.map(persona=>{
        if(persona.id===personaSeleccionada.id){
          persona.nombre=personaSeleccionada.nombre;
          persona.apellidos=personaSeleccionada.apellidos;
          persona.email=personaSeleccionada.email;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }

  const seleccionarPersona=(persona, caso)=>{
    setPersonaSeleccionada(persona);

    (caso==="Editar")&&
    abrirCerrarModalEditar()
  }

  useEffect(()=>{
    peticionesGet();
  },[])

  return (
    <div className="container" style={{textAlign:'center'}}>
      <h2>Sistema de manejo de usuarios</h2>
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
          {data.map(persona=>(
            <tr key={persona.id}>
              <td>{persona.id}</td>
              <td>{persona.nombre}</td>
              <td>{persona.apellidos}</td>
              <td>{persona.email}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarPersona(persona, "Editar")}>Editar</button>
                <button className="btn btn-danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar persona</ModalHeader>
        <ModalBody>
          <div className="form-group" >
            <label>Nombre:</label>
            <br/>
            <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
            <br/>
            <label>Apellidos:</label>
            <br/>
            <input type="text" className="form-control" name="apellidos" onChange={handleChange}/>
            <br/>
            <label>Email:</label>
            <br/>
            <input type="text" className="form-control" name="email" onChange={handleChange}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionesPost()}>Insertar</button>
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar persona</ModalHeader>
        <ModalBody>
          <div className="form-group" >
            <label>Nombre:</label>
            <br/>
            <input type="text" className="form-control" name="nombre" onChange={handleChange} value={personaSeleccionada && personaSeleccionada.nombre}/>
            <br/>
            <label>Apellidos:</label>
            <br/>
            <input type="text" className="form-control" name="apellidos" onChange={handleChange} value={personaSeleccionada && personaSeleccionada.apellidos}/>
            <br/>
            <label>Email:</label>
            <br/>
            <input type="text" className="form-control" name="email" onChange={handleChange} value={personaSeleccionada && personaSeleccionada.email}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionesPut()}>Insertar</button>
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
