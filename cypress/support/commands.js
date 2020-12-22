import _ from 'lodash';
import {
  buildCopyItemRoute,
  buildDeleteItemRoute,
  buildGetChildrenRoute,
  buildGetItemRoute,
  buildMoveItemRoute,
  buildPostItemRoute,
  GET_OWN_ITEMS_ROUTE,
} from '../../src/api/routes';
import { getParentsIdsFromPath } from '../../src/utils/item';
import { CURRENT_USER_ID } from '../fixtures/items';
import { ERROR_CODE, ID_FORMAT, generateUuidId } from './utils';

const API_HOST = Cypress.env('API_HOST');

Cypress.Commands.add(
  'setUpApi',
  ({
    items = [],
    deleteItemError = false,
    postItemError = false,
    moveItemError = false,
    copyItemError = false,
  } = {}) => {
    const cachedItems = _.cloneDeep(items);

    cy.intercept(
      {
        method: 'GET',
        url: `${API_HOST}/${GET_OWN_ITEMS_ROUTE}`,
      },
      (req) => {
        const own = cachedItems.filter(({ path }) => !path.includes('.'));
        req.reply(own);
      },
    ).as('getOwnItems');

    cy.intercept(
      {
        method: 'POST',
        url: new RegExp(
          `${API_HOST}/${buildPostItemRoute(
            ID_FORMAT,
          )}$|${API_HOST}/${buildPostItemRoute()}$`,
        ),
      },
      ({ body, reply }) => {
        if (postItemError) {
          return reply({ statusCode: ERROR_CODE });
        }

        // add necessary properties id, path and creator
        const id = generateUuidId();
        return reply({
          ...body,
          id,
          path: id.replaceAll('-', '_'),
          creator: CURRENT_USER_ID,
        });
      },
    ).as('postItem');

    cy.intercept(
      {
        method: 'DELETE',
        url: new RegExp(`${API_HOST}/${buildDeleteItemRoute(ID_FORMAT)}`),
      },
      ({ url, reply }) => {
        const id = url.slice(API_HOST.length).split('/')[2];
        reply({
          statusCode: deleteItemError ? ERROR_CODE : 200,
          body: cachedItems.find(({ id: thisId }) => id === thisId),
        });
      },
    ).as('deleteItem');

    cy.intercept(
      {
        method: 'GET',
        url: new RegExp(`${API_HOST}/${buildGetItemRoute(ID_FORMAT)}$`),
      },
      ({ url, reply }) => {
        const id = url.slice(API_HOST.length).split('/')[2];
        const item = cachedItems.find(({ id: thisId }) => id === thisId);
        reply(item);
      },
    ).as('getItem');

    cy.intercept(
      {
        method: 'GET',
        url: new RegExp(`${API_HOST}/${buildGetChildrenRoute(ID_FORMAT)}`),
      },
      ({ url, reply }) => {
        const id = url.slice(API_HOST.length).split('/')[2];
        const children = cachedItems.filter(({ path }) => {
          const ids = getParentsIdsFromPath(path);
          const found = ids.findIndex((thisId) => thisId === id);
          return found >= 0 && found + 2 === ids.length; // has id as parent and is direct children
        });
        reply(children);
      },
    ).as('getChildren');

    cy.intercept(
      {
        method: 'POST',
        url: new RegExp(`${API_HOST}/${buildMoveItemRoute(ID_FORMAT)}`),
      },
      ({ url, reply, body }) => {
        const id = url.slice(API_HOST.length).split('/')[2];
        // actually update cached items
        if (!moveItemError) {
          let path = id;
          if (body.parentId) {
            const parentItem = cachedItems.find(
              ({ id: thisId }) => thisId === body.parentId,
            );
            path = `${parentItem.path}.${id}`;
          }
          cachedItems.find(({ id: thisId }) => thisId === id).path = path;
          // todo: do for all children
        }
        reply({
          statusCode: moveItemError ? ERROR_CODE : 200,
          body: cachedItems.find(({ id: thisId }) => id === thisId), // this might not be accurate
        });
      },
    ).as('moveItem');

    cy.intercept(
      {
        method: 'POST',
        url: new RegExp(`${API_HOST}/${buildCopyItemRoute(ID_FORMAT)}`),
      },
      ({ url, reply, body }) => {
        const id = url.slice(API_HOST.length).split('/')[2];
        const item = cachedItems.find(({ id: thisId }) => id === thisId);
        const newId = generateUuidId();
        let newItem = null;
        // actually copy
        let path = newId;
        if (!copyItemError) {
          if (body.parentId) {
            const parentItem = cachedItems.find(
              ({ id: thisId }) => thisId === body.parentId,
            );
            path = `${parentItem.path}.${id}`;
          }
          newItem = { ...item, id: newId, path };
          cachedItems.push(newItem);
          // todo: do for all children
        }
        reply({
          statusCode: copyItemError ? ERROR_CODE : 200,
          body: newItem,
        });
      },
    ).as('copyItem');
  },
);
