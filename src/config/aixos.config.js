import axios from 'axios';

import { getToken } from '../services/auth.service';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8080',
});

API.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = token;
  }
  return config;
});

export default API;
