import { v4 as uuidv4 } from 'uuid';
import {
  buildCopyItemRoute,
  buildDeleteItemRoute,
  buildEditItemRoute,
  buildGetChildrenRoute,
  buildGetItemRoute,
  buildMoveItemRoute,
  buildPostItemRoute,
  GET_OWN_ITEMS_ROUTE,
  buildShareItemWithRoute,
  MEMBERS_ROUTE,
} from '../../src/api/routes';
import {
  getItemById,
  isChild,
  isRootItem,
  transformIdForPath,
} from '../../src/utils/item';
import { CURRENT_USER_ID } from '../fixtures/items';
import {
  ERROR_CODE,
  ID_FORMAT,
  parseStringToRegExp,
  SUCCESS_CODE,
  EMAIL_FORMAT,
} from './utils';
import {
  DEFAULT_PATCH,
  DEFAULT_GET,
  DEFAULT_POST,
  DEFAULT_DELETE,
} from '../../src/api/utils';

const API_HOST = Cypress.env('API_HOST');

export const mockGetOwnItems = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${GET_OWN_ITEMS_ROUTE}`,
    },
    (req) => {
      const own = items.filter(isRootItem);
      req.reply(own);
    },
  ).as('getOwnItems');
};

export const mockPostItem = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildPostItemRoute(ID_FORMAT),
        )}$|${API_HOST}/${buildPostItemRoute()}$`,
      ),
    },
    ({ body, reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: ERROR_CODE });
      }

      // add necessary properties id, path and creator
      const id = uuidv4();
      return reply({
        ...body,
        id,
        path: transformIdForPath(id),
        creator: CURRENT_USER_ID,
      });
    },
  ).as('postItem');
};

export const mockDeleteItem = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(`${API_HOST}/${buildDeleteItemRoute(ID_FORMAT)}`),
    },
    ({ url, reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: ERROR_CODE, body: null });
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      return reply({
        statusCode: SUCCESS_CODE,
        body: getItemById(items, id),
      });
    },
  ).as('deleteItem');
};

export const mockGetItem = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: ERROR_CODE, body: null });
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);
      return reply({
        body: item,
        statusCode: SUCCESS_CODE,
      });
    },
  ).as('getItem');
};

export const mockGetChildren = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetChildrenRoute(ID_FORMAT)}`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const children = items.filter(isChild(id));
      reply(children);
    },
  ).as('getChildren');
};

export const mockMoveItem = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildMoveItemRoute(ID_FORMAT)}`),
    },
    ({ url, reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: ERROR_CODE, body: null });
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);
      // actually update cached items
      let path = transformIdForPath(id);
      if (body.parentId) {
        const parentItem = getItemById(items, body.parentId);
        path = `${parentItem.path}.${path}`;
      }
      item.path = path;
      // todo: do for all children

      return reply({
        statusCode: SUCCESS_CODE,
        body: item, // this might not be accurate
      });
    },
  ).as('moveItem');
};

export const mockCopyItem = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildCopyItemRoute(ID_FORMAT)}`),
    },
    ({ url, reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: ERROR_CODE, body: null });
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);
      const newId = uuidv4();
      let newItem = null;
      // actually copy
      let path = transformIdForPath(newId);
      if (body.parentId) {
        const parentItem = getItemById(items, body.parentId);
        path = `${parentItem.path}.${path}`;
      }
      newItem = { ...item, id: newId, path };
      items.push(newItem);
      // todo: do for all children
      return reply({
        statusCode: SUCCESS_CODE,
        body: newItem,
      });
    },
  ).as('copyItem');
};

export const mockEditItem = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(`${API_HOST}/${buildEditItemRoute(ID_FORMAT)}`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: ERROR_CODE });
      }

      return reply(body);
    },
  ).as('editItem');
};

export const mockShareItem = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildShareItemWithRoute(ID_FORMAT),
        )}`,
      ),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: ERROR_CODE });
      }

      return reply(body);
    },
  ).as('shareItem');
};

export const mockGetMember = (members, shouldThrowError) => {
  const emailReg = new RegExp(EMAIL_FORMAT);
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      pathname: MEMBERS_ROUTE,
      query: {
        email: emailReg,
      },
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: ERROR_CODE });
      }

      const mail = emailReg.exec(url)[0];
      const member = members.find(({ email }) => email === mail);

      return reply([member]);
    },
  ).as('getMember');
};
