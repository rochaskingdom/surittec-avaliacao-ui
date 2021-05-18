import axios from 'axios';

const API = axios.create({
  baseURL: 'https://viacep.com.br/ws',
});

const findCEP = cep => {
  return API.get(`/${cep}/json`).then(res => res.data);
};

export default findCEP;
