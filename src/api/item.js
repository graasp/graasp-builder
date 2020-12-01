import { API_HOST } from '../config/constants';
import { DEFAULT_DELETE, DEFAULT_GET, DEFAULT_POST } from './utils';

// payload = {email}
export const getOwnItems = async () => {
  const req = await fetch(`${API_HOST}/items/own`, {
    ...DEFAULT_GET,
    headers: { 'Content-Type': 'application/json' },
  });
  return req.json();
};

// payload = {name, type, description, extra}
// querystring = {parentId}
export const createItem = async ({
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
  return req.json();
};

// payload = {name, type, description, extra}
// querystring = {parentId}
export const deleteItem = async (id) => {
  const req = await fetch(`${API_HOST}/items/${id}`, DEFAULT_DELETE);
  return req.json();
};

// we need this function for navigation purposes: when you click on an item, you want to see its 'immediate' children
export const fetchItemImmediateChildren = () => {};
