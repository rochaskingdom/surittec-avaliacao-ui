import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import NavBar from '../../components/NavBar';
import {
  cpfMask,
  telefoneMask,
  cepMask,
  celularMask,
  normalizeCep,
  normalizeCpf,
  normalizeTelefone,
} from '../../utils/masks';
import findCEP from '../../resources/via-cep.resource';
import UFS from '../../utils/ufs';
import {
  createCliente,
  getOne,
  updateCliente,
} from '../../resources/clientes.resource';

export default class ClienteForm extends Component {
  clienteId;

  isView = false;

  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      cpf: '',
      emails: [{ email: '' }],
      telefones: [{ numero: '', tipoTelefone: 'CELULAR' }],
      cep: '',
      logradouro: '',
      bairro: '',
      localidade: '',
      uf: 'Selecione',
      complemento: '',
      cepNotFound: false,
    };
  }

  componentDidMount = () => {
    // eslint-disable-next-line react/prop-types
    const { id } = this.props.match.params;

    if (this.props.match.path.includes('view')) {
      this.isView = true;
    }

    if (id) {
      this.initCliente(id);
    }
  };

  initCliente = id => {
    this.clienteId = id;
    getOne(id).then(res => {
      res.cpf = cpfMask(res.cpf);
      res.cep = cepMask(res.cep);
      res.telefones = res.telefones.map(item => {
        return {
          id: item.id,
          numero:
            item.tipoTelefone === 'CELULAR'
              ? celularMask(item.numero)
              : telefoneMask(item.numero),
          tipoTelefone: item.tipoTelefone,
        };
      });
      this.setState({ ...res });
    });
  };

  buildNomeInput = () => {
    const { nome } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_nome">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          required
          autoComplete="off"
          onChange={e => this.handleGenericChange(e, 'nome')}
          minLength="3"
          maxLength="100"
          type="text"
          value={nome}
          placeholder="Nome"
        />
      </Form.Group>
    );
  };

  buildCPFInput = () => {
    const { cpf } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_cpf">
        <Form.Label>CPF</Form.Label>
        <Form.Control
          required
          autoComplete="off"
          onChange={this.handleCPFtChange}
          value={cpf}
          type="text"
          placeholder="CPF"
        />
      </Form.Group>
    );
  };

  buildEmailInput = () => {
    const { emails } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_email">
        <Form.Label>E-mail</Form.Label>
        {emails.map((item, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <InputGroup className="pb-2" key={index}>
              <Form.Control
                required
                autoComplete="off"
                onChange={e => this.handleEmailChange(e, index)}
                type="email"
                value={item.email}
                placeholder="E-mail"
              />
              {this.buildRemoveButton(() => this.onRemovingEmail(index))}
            </InputGroup>
          );
        })}
        <Button onClick={this.onAddingMoreEmails}>
          Adicionar outro E-email
        </Button>
      </Form.Group>
    );
  };

  buildTelefoneInput = () => {
    const { telefones } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_telefone">
        <Form.Label>Telefone</Form.Label>
        {telefones.map((item, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <InputGroup className="pb-2" key={index}>
              <InputGroup.Prepend>
                <DropdownButton
                  id="id-cliente_form_telefone_tipo"
                  variant="success"
                  title={item.tipoTelefone}
                >
                  <Dropdown.Item
                    onClick={() =>
                      this.onTipoTelefoneSelected('RESIDENCIAL', index)
                    }
                  >
                    RESIDENCIAL
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() =>
                      this.onTipoTelefoneSelected('COMERCIAL', index)
                    }
                  >
                    COMERCIAL
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() =>
                      this.onTipoTelefoneSelected('CELULAR', index)
                    }
                  >
                    CELULAR
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup.Prepend>
              <Form.Control
                required
                autoComplete="off"
                onChange={e => this.handleTelefoneChange(e, index)}
                type="text"
                maxLength={this.handleTelefoneMaxLength(item.tipoTelefone)}
                value={item.numero}
                placeholder="Telefone"
              />
              {this.buildRemoveButton(() => this.onRemovingTelefone(index))}
            </InputGroup>
          );
        })}
        <Button onClick={this.onAddingMoreTelefones}>
          Adicionar outro telefone
        </Button>
      </Form.Group>
    );
  };

  buildRemoveButton = f => {
    return (
      <InputGroup.Append>
        <Button variant="danger" onClick={f}>
          <FontAwesomeIcon icon={faTrash} color="white" />
        </Button>
      </InputGroup.Append>
    );
  };

  buildCEPInput = () => {
    const { cep } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_cep">
        <Form.Label>CEP</Form.Label>
        <InputGroup className="pb-2">
          <Form.Control
            required
            autoComplete="off"
            onChange={this.handleCEPChange}
            minLength="9"
            maxLength="9"
            type="text"
            placeholder="CEP"
            value={cep}
          />
          <InputGroup.Append>
            <Button onClick={this.onSearchingCEP}>
              <FontAwesomeIcon icon={faSearch} color="white" />
            </Button>
          </InputGroup.Append>
        </InputGroup>
        {this.state.cepNotFound ? (
          <small className="text-danger">CEP não encontrado</small>
        ) : null}
      </Form.Group>
    );
  };

  buildLogradouroInput = () => {
    const { logradouro } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_logradouro">
        <Form.Label>Logradouro</Form.Label>
        <Form.Control
          required
          autoComplete="off"
          onChange={e => this.handleGenericChange(e, 'logradouro')}
          type="text"
          value={logradouro}
          placeholder="Logradouro"
        />
      </Form.Group>
    );
  };

  buildBairroInput = () => {
    const { bairro } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_bairro">
        <Form.Label>Bairro</Form.Label>
        <Form.Control
          required
          autoComplete="off"
          onChange={e => this.handleGenericChange(e, 'bairro')}
          type="text"
          value={bairro}
          placeholder="Bairro"
        />
      </Form.Group>
    );
  };

  buildLocalidadeInput = () => {
    const { localidade } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_localidade">
        <Form.Label>Cidade</Form.Label>
        <Form.Control
          required
          autoComplete="off"
          onChange={e => this.handleGenericChange(e, 'localidade')}
          type="text"
          value={localidade}
          placeholder="Cidade"
        />
      </Form.Group>
    );
  };

  buildUFInput = () => {
    const { uf } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_uf">
        <Form.Label>UF</Form.Label>
        <DropdownButton id="id-cliente_form_uf_dropdown" title={uf}>
          {UFS.map(item => {
            return (
              <Dropdown.Item
                key={item.ID}
                onClick={() => this.onUFSelection(item.Sigla)}
              >
                {item.Sigla}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </Form.Group>
    );
  };

  buildComplementoInput = () => {
    const { complemento } = this.state;

    return (
      <Form.Group controlId="id-cliente_form_complemento">
        <Form.Label>Complemento</Form.Label>
        <Form.Control
          onChange={e => this.handleGenericChange(e, 'complemento')}
          type="text"
          autoComplete="off"
          value={complemento}
          placeholder="Complemento"
        />
      </Form.Group>
    );
  };

  buildSubmitButton = () => {
    return <Button type="submit">Salvar</Button>;
  };

  buildCancelarButton = () => {
    return (
      <Button onClick={this.handleCancelar} variant="danger" type="button">
        Cancelar
      </Button>
    );
  };

  handleCancelar = () => {
    // eslint-disable-next-line react/prop-types
    const { history } = this.props;

    // eslint-disable-next-line react/prop-types
    history.push('/home');
  };

  handleEmailChange = (event, index) => {
    const { emails } = this.state;

    emails[index].email = event.target.value;

    this.setState({ emails });
  };

  handleGenericChange = (event, key) => {
    this.setState({ [key]: event.target.value });
  };

  handleCEPChange = e => {
    this.setState({ cep: cepMask(e.target.value) });
  };

  handleCPFtChange = e => {
    this.setState({ cpf: cpfMask(e.target.value) });
  };

  handleTelefoneChange = (event, index) => {
    const { telefones } = this.state;

    if (telefones[index].tipoTelefone === 'CELULAR') {
      telefones[index].numero = celularMask(event.target.value);
    } else {
      telefones[index].numero = telefoneMask(event.target.value);
    }

    this.setState({ telefones });
  };

  handleTelefoneMaxLength = tipo => {
    if (tipo === 'CELULAR') return 15;
    return 14;
  };

  onAddingMoreEmails = () => {
    const { emails } = this.state;

    this.setState({ emails: [...emails, { email: '' }] });
  };

  onAddingMoreTelefones = () => {
    const { telefones } = this.state;

    this.setState({
      telefones: [...telefones, { numero: '', tipoTelefone: 'CELULAR' }],
    });
  };

  onRemovingEmail = index => {
    const { emails } = this.state;
    if (emails.length === 1) return;

    emails.splice(index, 1);
    this.setState({ emails });
  };

  onRemovingTelefone = index => {
    const { telefones } = this.state;
    if (telefones.length === 1) return;

    telefones.splice(index, 1);
    this.setState({ telefones });
  };

  onUFSelection = uf => {
    this.setState({ uf });
  };

  onSearchingCEP = () => {
    const { cep } = this.state;
    const cepString = normalizeCep(cep);
    if (cepString.length !== 8) return;

    findCEP(cep).then(this.onSuccessfulCEPSearch);
  };

  onSuccessfulCEPSearch = cep => {
    if (cep.hasOwnProperty('erro')) {
      this.setState({ cepNotFound: true });
      return;
    }
    this.setState({ cepNotFound: false });

    Object.keys(cep).forEach(key => {
      this.setState({ [key]: cep[key] });
    });
  };

  onTipoTelefoneSelected = (tipo, index) => {
    const { telefones } = this.state;
    telefones[index].tipoTelefone = tipo;
    this.setState({ telefones: [...telefones] });
  };

  onSubmission = e => {
    e.preventDefault();
    const userToSave = { ...this.state };
    const { cpf, cep } = userToSave;
    // eslint-disable-next-line react/prop-types
    const { history } = this.props;

    userToSave.cpf = normalizeCpf(cpf);
    userToSave.cep = normalizeCep(cep);
    userToSave.telefones.forEach(item => {
      // eslint-disable-next-line no-param-reassign
      item.numero = normalizeTelefone(item.numero);
    });

    if (this.clienteId) {
      // eslint-disable-next-line react/prop-types
      updateCliente(this.clienteId, userToSave).then(() =>
        history.push('/home')
      );
    } else {
      // eslint-disable-next-line react/prop-types
      createCliente(userToSave).then(() => history.push('/home'));
    }
  };

  render() {
    return (
      <>
        <NavBar props={this.props} />
        <fieldset disabled={this.isView}>
          <Form onSubmit={this.onSubmission}>
            <Container className="container-fluid pt-3 pb-5">
              <Row className="justify-content-center">
                <Col md="6" col="12">
                  <legend>Dados do Cliente</legend>
                  {this.buildNomeInput()}
                  {this.buildCPFInput()}
                </Col>
                <Col md="6" col="12">
                  <legend>Dados de Contato</legend>
                  {this.buildEmailInput()}
                  {this.buildTelefoneInput()}
                </Col>
                <Col md="12" col="12">
                  <legend>Dados de Endereço</legend>
                  {this.buildCEPInput()}
                  {this.buildLogradouroInput()}
                  {this.buildComplementoInput()}
                  {this.buildBairroInput()}
                  {this.buildLocalidadeInput()}
                  {this.buildUFInput()}
                </Col>
                <Col md="8" className="flex-row-reverse d-flex">
                  <ButtonGroup>
                    {this.buildCancelarButton()}
                    {this.buildSubmitButton()}
                  </ButtonGroup>
                </Col>
              </Row>
            </Container>
          </Form>
        </fieldset>
      </>
    );
  }
}
