import jwt from 'jwt-decode';

const TOKEN_KEY = 'jwt-token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;
  return jwt(token.split('Bearer ')[1]);
};

export const isUserAdmin = () => {
  const token = getDecodedToken();
  if (!token) return false;
  return !!token.ROLES.find(item => {
    return item.includes('ADMIN');
  });
};

export const saveUser = token => {
  localStorage.setItem(TOKEN_KEY, token);
};
