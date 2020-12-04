import { API_HOST } from '../config/constants';
import { DEFAULT_GET, DEFAULT_POST } from './utils';

// payload = {email}
export const signIn = async (payload) => {
  const req = await fetch(`${API_HOST}/login`, {
    ...DEFAULT_POST,
    body: JSON.stringify(payload),
  });
  return req.status === 204;
};

export const signOut = async () => {
  const req = await fetch(`${API_HOST}/logout`, DEFAULT_GET);
  return req.status === 204;
};

// payload = {name, mail}
export const signUp = async (payload) => {
  const req = await fetch(`${API_HOST}/register`, {
    ...DEFAULT_POST,
    body: JSON.stringify(payload),
  });
  return req.status === 204;
};
