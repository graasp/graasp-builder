import { API_HOST } from '../config/constants';
import { DEFAULT_DELETE, DEFAULT_GET, DEFAULT_POST } from './utils';

// payload = {id}
export const getItem = async (id) => {
  const req = await fetch(`${API_HOST}/items/${id}`, {
    ...DEFAULT_GET,
    headers: { 'Content-Type': 'application/json' },
  });
  return req.json();
};

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

  if (req.status !== 200) {
    return null;
  }

  return req.json();
};

// payload = {name, type, description, extra}
// querystring = {parentId}
export const deleteItem = async (id) => {
  const req = await fetch(`${API_HOST}/items/${id}`, DEFAULT_DELETE);
  return req.json();
};

// we need this function for navigation purposes: when you click on an item, you want to see its 'immediate' children
export const getChildren = async (id) => {
  const req = await fetch(`${API_HOST}/items/${id}/children`, DEFAULT_GET);
  return req.json();
};

export const getItemTree = async (ownedItems) => {
  // todo: use parallel promises
  const items = JSON.parse(JSON.stringify(ownedItems));
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    // eslint-disable-next-line no-await-in-loop
    const children = await getChildren(item.id);
    item.children = children;
  }
  return items;
};
