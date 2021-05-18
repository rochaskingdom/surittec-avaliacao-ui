import API from '../config/aixos.config';

const RESOURCE_URL = '/api/clientes';

export const getAllClientes = () => {
  return API.get(RESOURCE_URL).then(res => res.data);
};

export const getOne = clienteId => {
  return API.get(`${RESOURCE_URL}/${clienteId}`).then(res => res.data);
};

export const createCliente = cliente => {
  return API.post(RESOURCE_URL, cliente).then(res => res.data);
};

export const updateCliente = (clienteId, cliente) => {
  return API.put(`${RESOURCE_URL}/${clienteId}`, cliente).then(res => res.data);
};

export const deleteCliente = clienteId => {
  return API.delete(`${RESOURCE_URL}/${clienteId}`);
};
