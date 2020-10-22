import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Jumbotron, Container } from 'reactstrap';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {

  const baseUrl="http://localhost:8080/apiFrameworks/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
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

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionesGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      /*console.log(response.data);*/
      setData(response.data);
    }).catch(error=>{
      console.log(error);
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
    }).catch(error=>{
      console.log(error);
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
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionesDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: personaSeleccionada.id}})
    .then(response=>{
      setData(data.filter(persona=>persona.id!==personaSeleccionada.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarPersona=(persona, caso)=>{
    setPersonaSeleccionada(persona);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionesGet();
  },[])

  return (
    <div className="container" style={{textAlign:'center'}}>
      <Jumbotron fluid>
      <Container fluid>
        <h2>Sistema de manejo de usuarios</h2>
      </Container>
      </Jumbotron>
      
      <button className="btn btn-primary btn-lg btn-block"  onClick={()=>abrirCerrarModalInsertar()} >Añadir nuevo registro</button>
      <br/>
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
                <button className="btn btn-danger" onClick={()=>seleccionarPersona(persona, "Eliminar")}>Eliminar</button>
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

      <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el registro de {personaSeleccionada && personaSeleccionada.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionesDelete()}>Sí</button>
          <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
