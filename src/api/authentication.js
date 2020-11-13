import { API_HOST } from '../config/constants';

// payload = {email}
export const getOwnItems = async () => {
  const req = await fetch(`${API_HOST}/own`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(req)
};

// payload = {email}
export const createItem = async () => {
  const req = await fetch(`${API_HOST}/items`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({name:'myitem'}),
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(await req.json())
};

// payload = {email}
export const signIn = async (payload) => {
  const req = await fetch(`${API_HOST}/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
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
