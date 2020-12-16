import { API_HOST } from '../config/constants';
import { DEFAULT_DELETE, DEFAULT_GET, DEFAULT_POST } from './utils';

export const getItem = async (id) => {
  const req = await fetch(`${API_HOST}/items/${id}`, DEFAULT_GET);
  if (!req.ok) {
    throw new Error((await req.json()).message);
  }
  return req.json();
};

export const getOwnItems = async () => {
  const req = await fetch(`${API_HOST}/items/own`, DEFAULT_GET);

  if (!req.ok) {
    throw new Error((await req.json()).message);
  }

  return req.json();
};

// payload = {name, type, description, extra}
// querystring = {parentId}
export const postItem = async ({
  name,
  type,
  description,
  extra,
  parentId,
} = {}) => {
  let url = `${API_HOST}/items`;
  if (parentId) {
    url += `?parentId=${parentId}`;
  }
  const req = await fetch(url, {
    ...DEFAULT_POST,
    body: JSON.stringify({ name, type, description, extra }),
  });

  if (!req.ok) {
    throw new Error((await req.json()).message);
  }

  return req.json();
};

export const deleteItem = async (id) => {
  const req = await fetch(`${API_HOST}/items/${id}`, DEFAULT_DELETE);

  if (!req.ok) {
    throw new Error((await req.json()).message);
  }
  return req.json();
};

export const getChildren = async (id) => {
  const req = await fetch(`${API_HOST}/items/${id}/children`, DEFAULT_GET);

  if (!req.ok) {
    throw new Error((await req.json()).message);
  }
  return req.json();
};
