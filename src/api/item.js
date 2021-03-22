import { v4 as uuidv4 } from 'uuid';
import { API_HOST, ITEM_TYPES, ROOT_ID } from '../config/constants';
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
  // -------- TO REMOVE
  const id = 'c4dea86a-5d7c-4144-b038-20b746793e12';
  const item = {
    id,
    name: 'namename',
    path: id.replaceAll('-', '_'),
    type: ITEM_TYPES.LINK,
    description: 'desc',
    extra: {
      embeddedLinkItem: {
        url: 'https://graasp.eu',
        html:
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZAzWT8mRoR0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        icons: [
          'https://graasp.eu/cdn/img/epfl/favicons/favicon-32x32.png?v=yyxJ380oWY',
        ],
        thumbnails: ['https://graasp.eu/img/epfl/logo-tile.png'],
      },
    },
  };
  await CacheOperations.createItem({ item });
  // eslint-disable-next-line no-console
  console.log(GET_OWN_ITEMS_ROUTE);
  return [item];

  // -------- TO REMOVE

  // const res = await fetch(`${API_HOST}/${GET_OWN_ITEMS_ROUTE}`, DEFAULT_GET);

  // if (!res.ok) {
  //   throw new Error((await res.json()).message);
  // }

  // const ownItems = await res.json();

  // await CacheOperations.saveItems(ownItems);

  // return ownItems;
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
  // -------- TO REMOVE
  if (type === ITEM_TYPES.LINK) {
    // eslint-disable-next-line no-console
    console.log('weiufhskdjn');
    const newExtra = extra;
    // newExtra.embeddedLinkItem.html = 'someplayer';
    newExtra.embeddedLinkItem.thumbnails = ['link'];
    newExtra.embeddedLinkItem.icons = ['link'];
    const newItem = {
      id: uuidv4(),
      name,
      type,
      description,
      extra: newExtra,
    };
    await CacheOperations.createItem({ item: newItem });
    return newItem;
  }

  // -------- TO REMOVE

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
  );
  return response.json();
};

export const getS3FileUrl = async ({ id }) => {
  const response = await fetch(
    `${API_HOST}/${buildGetS3MetadataRoute(id)}`,
    DEFAULT_GET,
  );
  const { key } = await response.json();
  return buildS3FileUrl(key);
};
