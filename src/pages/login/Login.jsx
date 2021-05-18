import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Container from 'react-bootstrap/Container';
import singIn from '../../resources/login.resource';
import { saveUser } from '../../services/auth.service';
import {Jumbotron} from "react-bootstrap";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      error: null,
    };
  }

  handleInputChanges = (event, field) => {
    this.setState({ [field]: event.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await singIn(this.state);
      saveUser(res.headers.authorization);
      const { history } = this.props;
      history.push('/home');
    } catch (err) {
      console.error('Error ao realizar login: ', err);
    }
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <Container className="container-fluid">
            <Row className="justify-content-md-center mt-xl-5">
              <Col lg="7">
                <Jumbotron>
                  <h1 className="align-items-center">Avaliação Desenvolvedor Pleno</h1>
                </Jumbotron>
              </Col>
            </Row>
            <Row className="justify-content-md-center mt-xl-5">
              <Col lg="4">
                <Form.Group controlId="id-login_form">
                  <Form.Label>
                    <strong>Usuário:</strong>
                  </Form.Label>
                  <Form.Control
                    autoComplete="off"
                    required
                    type="text"
                    placeholder="Informe o usuário"
                    onChange={event => this.handleInputChanges(event, 'login')}
                  />
                </Form.Group>

                <Form.Group controlId="id-password_form">
                  <Form.Label><strong>Senha:</strong></Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Informe a senha"
                    onChange={event =>
                      this.handleInputChanges(event, 'password')
                    }
                  />
                </Form.Group>

                <Button variant="primary" type="submit" block>
                  <strong>Entrar</strong>
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </div>
    );
  }
}
