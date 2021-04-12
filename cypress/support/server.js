import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import qs from 'querystring';
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
  ITEMS_ROUTE,
  buildUploadFilesRoute,
  buildDownloadFilesRoute,
  buildGetS3MetadataRoute,
  buildS3UploadFileRoute,
  GET_CURRENT_MEMBER_ROUTE,
  buildSignInPath,
  SIGN_OUT_ROUTE,
} from '../../src/api/routes';
import {
  getItemById,
  isChild,
  isRootItem,
  transformIdForPath,
} from '../../src/utils/item';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import { ID_FORMAT, parseStringToRegExp, EMAIL_FORMAT } from './utils';
import {
  DEFAULT_PATCH,
  DEFAULT_GET,
  DEFAULT_POST,
  DEFAULT_DELETE,
} from '../../src/api/utils';
import { getS3FileExtra } from '../../src/utils/itemExtra';
import { REDIRECTION_CONTENT } from './constants';

const API_HOST = Cypress.env('API_HOST');
const S3_FILES_HOST = Cypress.env('S3_FILES_HOST');

export const redirectionReply = {
  headers: { 'content-type': 'text/html' },
  statusCode: StatusCodes.OK,
  body: REDIRECTION_CONTENT,
};

export const mockGetCurrentMember = (shouldThrowError = false) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${GET_CURRENT_MEMBER_ROUTE}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      // avoid sign in redirection
      const current = MEMBERS.ANNA;
      return reply(current);
    },
  ).as('getCurrentMember');
};

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
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      // add necessary properties id, path and creator
      const id = uuidv4();
      return reply({
        ...body,
        id,
        path: transformIdForPath(id),
        creator: CURRENT_USER.id,
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
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      return reply({
        statusCode: StatusCodes.OK,
        body: getItemById(items, id),
      });
    },
  ).as('deleteItem');
};

export const mockDeleteItems = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      pathname: `/${ITEMS_ROUTE}`,
      query: { id: ID_FORMAT },
    },
    ({ url, reply }) => {
      const ids = qs.parse(url.slice(url.indexOf('?') + 1)).id;

      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      return reply({
        statusCode: StatusCodes.OK,
        body: ids.map((id) => getItemById(items, id)),
      });
    },
  ).as('deleteItems');
};

export const mockGetItem = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);
      return reply({
        body: item,
        statusCode: StatusCodes.OK,
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
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
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
        statusCode: StatusCodes.OK,
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
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
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
        statusCode: StatusCodes.OK,
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
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
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
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
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
      pathname: `/${MEMBERS_ROUTE}`,
      query: {
        email: emailReg,
      },
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const mail = emailReg.exec(url)[0];
      const member = members.find(({ email }) => email === mail);

      return reply([member]);
    },
  ).as('getMember');
};

// mock upload item for default and s3 upload methods
export const mockUploadItem = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildUploadFilesRoute(ID_FORMAT),
        )}$|${API_HOST}/${buildUploadFilesRoute()}$|${API_HOST}/${parseStringToRegExp(
          buildS3UploadFileRoute(ID_FORMAT),
        )}$|${API_HOST}/${buildS3UploadFileRoute()}$`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(false);
    },
  ).as('uploadItem');
};

export const mockDefaultDownloadFile = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildDownloadFilesRoute(ID_FORMAT),
        )}$`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const { filepath } = items.find(({ id: thisId }) => id === thisId);
      reply({ fixture: filepath });
    },
  ).as('downloadFile');
};

export const mockGetS3Metadata = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetS3MetadataRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const { extra } = items.find(({ id: thisId }) => id === thisId);

      reply(getS3FileExtra(extra));
    },
  ).as('getS3Metadata');
};

// intercept s3 file link and serve corresponding cypress fixture
export const mockGetS3FileContent = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${parseStringToRegExp(S3_FILES_HOST, {
          characters: ['.', '-'],
        })}/[a-zA-Z0-1\\/]+\\.[a-z0-1]+$`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      const filepath = url.slice(S3_FILES_HOST.length);
      reply({ fixture: filepath });
    },
  ).as('getS3FileContent');
};

export const mockSignInRedirection = () => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(buildSignInPath()),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('signInRedirection');
};

export const mockSignOut = () => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(SIGN_OUT_ROUTE),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('signOut');
};
