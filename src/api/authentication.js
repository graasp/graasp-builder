import { API_HOST } from '../config/constants';

// payload = {email}
export const signIn = async (payload) => {
  const req = await fetch(`${API_HOST}/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return req.status === 204;
};

export const signOut = async () => {
  const req = await fetch(`${API_HOST}/logout`, {
    credentials: 'include',
    method: 'GET',
  });
  return req.status === 204;
};

// payload = {name, mail}
export const register = async (payload) => {
  const req = await fetch(`${API_HOST}/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return req.status === 204;
};
