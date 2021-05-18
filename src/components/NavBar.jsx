import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { isUserAdmin, removeToken } from '../services/auth.service';

// eslint-disable-next-line react/prop-types
const NavBar = ({ props }) => {
  let canShowNovoCliente = true;
  const isAdm = isUserAdmin();

  if (props && props.match.path === '/cliente/new') {
    canShowNovoCliente = false;
  }
  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand href="/">Avaliação CRUD</Navbar.Brand>
      <Nav className="mr-auto">
        {canShowNovoCliente && isAdm ? (
          <Nav.Link className="text-primary" href="/cliente/new">
            Novo Cliente
          </Nav.Link>
        ) : null}
        <Nav.Link className="text-danger" href="/login" onClick={removeToken}>
          Sair
        </Nav.Link>
        <Nav.Link className="text-secondary" href="/home">
          Voltar
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavBar;
