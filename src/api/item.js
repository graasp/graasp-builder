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
  buildS3UploadFileRoute,
} from './routes';
import {
  DEFAULT_DELETE,
  DEFAULT_GET,
  DEFAULT_POST,
  DEFAULT_PATCH,
  failOnError,
} from './utils';
import { getParentsIdsFromPath } from '../utils/item';

export const getItem = async (id) => {
  const res = await fetch(
    `${API_HOST}/${buildGetItemRoute(id)}`,
    DEFAULT_GET,
  ).then(failOnError);
  const item = await res.json();
  return item;
};

export const getOwnItems = async () => {
  const res = await fetch(
    `${API_HOST}/${GET_OWN_ITEMS_ROUTE}`,
    DEFAULT_GET,
  ).then(failOnError);

  return res.json();
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
  }).then(failOnError);

  const newItem = await res.json();

  return newItem;
};

export const deleteItem = async (id) => {
  const res = await fetch(
    `${API_HOST}/${buildDeleteItemRoute(id)}`,
    DEFAULT_DELETE,
  ).then(failOnError);

  return res.json();
};

export const deleteItems = async (ids) => {
  const res = await fetch(
    `${API_HOST}/${buildDeleteItemsRoute(ids)}`,
    DEFAULT_DELETE,
  ).then(failOnError);

  return res.json();
};

// payload = {name, type, description, extra}
// querystring = {parentId}
export const editItem = async (item) => {
  const req = await fetch(`${API_HOST}/${buildEditItemRoute(item.id)}`, {
    ...DEFAULT_PATCH,
    body: JSON.stringify(item),
  }).then(failOnError);

  const newItem = await req.json();
  return newItem;
};

export const getChildren = async (id) => {
  const res = await fetch(
    `${API_HOST}/${buildGetChildrenRoute(id)}`,
    DEFAULT_GET,
  ).then(failOnError);

  const children = await res.json();

  return children;
};

export const getParents = async ({ path }) => {
  const parentIds = getParentsIdsFromPath(path, { ignoreSelf: true });
  if (parentIds.length) {
    return Promise.all(parentIds.map((id) => getItem(id)));
  }
  return [];
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
  }).then(failOnError);

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
  }).then(failOnError);

  const newItem = await res.json();

  return newItem;
};

export const getSharedItems = async () => {
  const res = await fetch(`${API_HOST}/${SHARE_ITEM_WITH_ROUTE}`, {
    ...DEFAULT_GET,
  }).then(failOnError);

  return res.json();
};

export const getFileContent = async ({ id }) => {
  const response = await fetch(
    `${API_HOST}/${buildDownloadFilesRoute(id)}`,
    DEFAULT_GET,
  );
  return response;
};

export const uploadItemToS3 = async ({ itemId, filename, contentType }) => {
  const response = await fetch(
    `${API_HOST}/${buildS3UploadFileRoute(itemId)}`,
    {
      // Send and receive JSON.
      ...DEFAULT_POST,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        contentType,
      }),
    },
  ).then(failOnError);

  return response.json();
};

export const getS3FileUrl = async ({ id }) => {
  const response = await fetch(
    `${API_HOST}/${buildGetS3MetadataRoute(id)}`,
    DEFAULT_GET,
  ).then(failOnError);

  const { key } = await response.json();
  return buildS3FileUrl(key);
};
