import API from '../config/aixos.config';

const singIn = ({ login, password }) => {
  return API.post('/login', { login, password });
};

export default singIn;
