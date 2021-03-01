import { API_HOST, ROOT_ID } from '../config/constants';
import {
  buildCopyItemRoute,
  buildDeleteItemRoute,
  buildDeleteItemsRoute,
  buildDownloadFilesRoute,
  buildEditItemRoute,
  buildGetChildrenRoute,
  buildGetItemRoute,
  buildGetS3MetadataRoute,
  buildMoveItemRoute,
  buildPostItemRoute,
  GET_OWN_ITEMS_ROUTE,
  SHARE_ITEM_WITH_ROUTE,
  buildS3FileUrl,
} from './routes';
import {
  DEFAULT_DELETE,
  DEFAULT_GET,
  DEFAULT_POST,
  DEFAULT_PATCH,
} from './utils';
import * as CacheOperations from '../config/cache';

export const getItem = async (id) => {
  const cachedItem = await CacheOperations.getItem(id);
  if (cachedItem && !cachedItem.dirty) {
    return cachedItem;
  }

  const res = await fetch(`${API_HOST}/${buildGetItemRoute(id)}`, DEFAULT_GET);
  if (!res.ok) {
    throw new Error((await res.json()).message);
  }
  const item = await res.json();
  await CacheOperations.saveItem(item);
  return item;
};

export const getItems = () => CacheOperations.getItems();

export const getOwnItems = async () => {
  const res = await fetch(`${API_HOST}/${GET_OWN_ITEMS_ROUTE}`, DEFAULT_GET);

  if (!res.ok) {
    throw new Error((await res.json()).message);
  }

  const ownItems = await res.json();

  await CacheOperations.saveItems(ownItems);

  return ownItems;
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
  const res = await fetch(`${API_HOST}/${buildPostItemRoute(parentId)}`, {
    ...DEFAULT_POST,
    body: JSON.stringify({ name, type, description, extra }),
  });

  const newItem = await res.json();

  if (!res.ok) {
    throw new Error(newItem.message);
  }

  await CacheOperations.createItem({ item: newItem });
  return newItem;
};

export const deleteItem = async (id) => {
  const res = await fetch(
    `${API_HOST}/${buildDeleteItemRoute(id)}`,
    DEFAULT_DELETE,
  );

  if (!res.ok) {
    throw new Error((await res.json()).message);
  }
  await CacheOperations.deleteItem(id);

  return res.json();
};

export const deleteItems = async (ids) => {
  const res = await fetch(
    `${API_HOST}/${buildDeleteItemsRoute(ids)}`,
    DEFAULT_DELETE,
  );

  if (!res.ok) {
    throw new Error((await res.json()).message);
  }
  await CacheOperations.deleteItems(ids);

  return res.json();
};

// payload = {name, type, description, extra}
// querystring = {parentId}
export const editItem = async (item) => {
  const req = await fetch(`${API_HOST}/${buildEditItemRoute(item.id)}`, {
    ...DEFAULT_PATCH,
    body: JSON.stringify(item),
  });

  if (!req.ok) {
    throw new Error((await req.json()).message);
  }

  const newItem = await req.json();

  await CacheOperations.saveItem(newItem);

  return newItem;
};

// we need this function for navigation purposes: when you click on an item, you want to see its 'immediate' children
export const getChildren = async (id) => {
  const res = await fetch(
    `${API_HOST}/${buildGetChildrenRoute(id)}`,
    DEFAULT_GET,
  );

  const children = await res.json();

  if (!res.ok) {
    throw new Error(children.message);
  }
  await CacheOperations.saveItems(children);
  return children;
};

export const moveItem = async (payload) => {
  const { to, id } = payload;
  const body = {};
  // send parentId only for non-root item
  if (to !== ROOT_ID) {
    body.parentId = to;
  }
  const res = await fetch(`${API_HOST}/${buildMoveItemRoute(id)}`, {
    ...DEFAULT_POST,
    body: JSON.stringify(body),
  });

  if (res.ok) {
    await CacheOperations.moveItem(payload);
  }

  return res.ok;
};

export const copyItem = async ({ id, to }) => {
  const body = {};
  // send parentId only for non-root item
  if (to !== ROOT_ID) {
    body.parentId = to;
  }
  const res = await fetch(`${API_HOST}/${buildCopyItemRoute(id)}`, {
    ...DEFAULT_POST,
    body: JSON.stringify(body),
  });

  const newItem = await res.json();

  if (!res.ok) {
    throw new Error(newItem);
  }

  await CacheOperations.saveItem(newItem);

  return newItem;
};

export const getSharedItems = async () => {
  const res = await fetch(`${API_HOST}/${SHARE_ITEM_WITH_ROUTE}`, {
    ...DEFAULT_GET,
  });

  if (!res.ok) {
    throw new Error(res);
  }

  return res.json();
};

export const getFileContent = async ({ id }) =>
  fetch(`${API_HOST}/${buildDownloadFilesRoute(id)}`, DEFAULT_GET);

export const getS3FileUrl = async ({ id }) => {
  const response = await fetch(
    `${API_HOST}/${buildGetS3MetadataRoute(id)}`,
    DEFAULT_GET,
  );
  const { key } = await response.json();
  return buildS3FileUrl(key);
};
