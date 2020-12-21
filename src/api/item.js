import { API_HOST } from '../config/constants';
import {
  buildDeleteItemRoute,
  buildGetChildrenRoute,
  buildGetItemRoute,
  buildPostItemRoute,
  GET_OWN_ITEMS_ROUTE,
} from './routes';
import { DEFAULT_DELETE, DEFAULT_GET, DEFAULT_POST } from './utils';

export const getItem = async (id) => {
  const req = await fetch(`${API_HOST}/${buildGetItemRoute(id)}`, DEFAULT_GET);
  if (!req.ok) {
    throw new Error((await req.json()).message);
  }
  return req.json();
};

export const getOwnItems = async () => {
  const req = await fetch(`${API_HOST}/${GET_OWN_ITEMS_ROUTE}`, DEFAULT_GET);

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
  const req = await fetch(`${API_HOST}/${buildPostItemRoute(parentId)}`, {
    ...DEFAULT_POST,
    body: JSON.stringify({ name, type, description, extra }),
  });

  if (!req.ok) {
    throw new Error((await req.json()).message);
  }

  return req.json();
};

export const deleteItem = async (id) => {
  const req = await fetch(
    `${API_HOST}/${buildDeleteItemRoute(id)}`,
    DEFAULT_DELETE,
  );

  if (!req.ok) {
    throw new Error((await req.json()).message);
  }
  return req.json();
};

export const getChildren = async (id) => {
  const req = await fetch(
    `${API_HOST}/${buildGetChildrenRoute(id)}`,
    DEFAULT_GET,
  );

  if (!req.ok) {
    throw new Error((await req.json()).message);
  }
  return req.json();
};
