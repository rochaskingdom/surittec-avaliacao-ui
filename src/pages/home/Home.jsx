import React, { Component } from 'react';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { cepMask, cpfMask } from '../../utils/masks';
import {
  deleteCliente,
  getAllClientes,
} from '../../resources/clientes.resource';
import NavBar from '../../components/NavBar';
import { isUserAdmin } from '../../services/auth.service';

class Home extends Component {
  clienteToRemove;

  isAdmin;

  constructor(props) {
    super(props);
    this.state = {
      clientes: [],
      showModal: false,
    };
    this.isAdmin = isUserAdmin();
  }

  componentDidMount() {
    this.findAll();
  }

  findAll = () => {
    getAllClientes().then(res => {
      this.setState({ clientes: res });
    });
  };

  handleShow = clienteId => {
    const { showModal } = this.state;
    if (!showModal || typeof clienteId === 'number') {
      this.clienteToRemove = clienteId;
    }
    this.setState({ showModal: !showModal });
  };

  modal = () => {
    const { showModal } = this.state;

    return (
      <Modal show={showModal} onHide={this.handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Remover Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deja remover esse Cliente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleShow}>
            cancelar
          </Button>
          <Button variant="primary" onClick={this.onRemove}>
            Remover
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  onNavigation = (id, action) => {
    const { history } = this.props;

    history.push(`/cliente/${action}/${id}`);
  };

  onRemove = () => {
    if (this.clienteToRemove) {
      deleteCliente(this.clienteToRemove).then(this.findAll);
      this.handleShow(null);
    }
  };

  render() {
    const { clientes } = this.state;

    return (
      <>
        {this.modal()}
        <NavBar />
        <h1 align="center" className="p-4">
          CRUD de Cliente
        </h1>
        <Row className="justify-content-md-center align-items-center">
          <Col md="12" lg="9">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>CEP</th>
                  <th>Cidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cliente => {
                  return (
                    <tr key={cliente.id}>
                      <td>{cliente.nome}</td>
                      <td>{cpfMask(cliente.cpf)}</td>
                      <td>{cepMask(cliente.cep)}</td>
                      <td>{cliente.localidade}</td>
                      <td width="10">
                        <ButtonGroup>
                          {isUserAdmin() ? (
                            <Button
                              onClick={() =>
                                this.onNavigation(cliente.id, 'edit')
                              }
                              variant="warning"
                            >
                              Editar
                            </Button>
                          ) : null}
                          <Button
                            onClick={() =>
                              this.onNavigation(cliente.id, 'view')
                            }
                            variant="info"
                          >
                            Visualizar
                          </Button>
                          {isUserAdmin() ? (
                            <Button
                              variant="danger"
                              onClick={() => this.handleShow(cliente.id)}
                            >
                              Excluir
                            </Button>
                          ) : null}
                        </ButtonGroup>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </>
    );
  }
}

export default Home;
