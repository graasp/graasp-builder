import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import qs from 'querystring';
import { API_ROUTES } from '@graasp/query-client';
import {
  getItemById,
  getParentsIdsFromPath,
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
  DEFAULT_PUT,
} from '../../src/api/utils';
import {
  getS3FileExtra,
  getItemLoginExtra,
  getItemLoginSchema,
  buildItemLoginSchemaExtra,
} from '../../src/utils/itemExtra';
import { SETTINGS } from '../../src/config/constants';
import { ITEM_LOGIN_TAG, ITEM_PUBLIC_TAG } from '../fixtures/itemTags';
import { getMemberById } from '../../src/utils/member';
import { PERMISSION_LEVELS } from '../../src/enums';
import {
  buildAppApiAccessTokenRoute,
  buildAppItemLinkForTest,
  buildGetAppData,
} from '../fixtures/apps';

const {
  buildCopyItemRoute,
  buildDeleteItemRoute,
  buildEditItemRoute,
  buildGetPublicItemRoute,
  buildGetChildrenRoute,
  buildGetPublicChildrenRoute,
  buildGetItemRoute,
  buildMoveItemRoute,
  buildPostItemRoute,
  GET_OWN_ITEMS_ROUTE,
  buildShareItemWithRoute,
  buildGetMember,
  buildGetMemberBy,
  ITEMS_ROUTE,
  buildUploadFilesRoute,
  buildDownloadFilesRoute,
  buildGetS3MetadataRoute,
  buildS3UploadFileRoute,
  GET_CURRENT_MEMBER_ROUTE,
  buildSignInPath,
  SIGN_OUT_ROUTE,
  buildPostItemLoginSignInRoute,
  buildGetItemLoginRoute,
  buildGetItemMembershipsForItemRoute,
  buildGetItemTagsRoute,
  GET_TAGS_ROUTE,
  buildPutItemLoginSchema,
  buildPostItemTagRoute,
  buildPatchMember,
  SHARE_ITEM_WITH_ROUTE,
  buildEditItemMembershipRoute,
  buildDeleteItemMembershipRoute,
  buildPostItemFlagRoute,
  GET_FLAGS_ROUTE,
  buildGetItemChatRoute,
  buildPostItemChatMessageRoute,
} = API_ROUTES;

const API_HOST = Cypress.env('API_HOST');
const S3_FILES_HOST = Cypress.env('S3_FILES_HOST');
const AUTHENTICATION_HOST = Cypress.env('AUTHENTICATION_HOST');

const checkMembership = ({ item, currentMember }) => {
  // mock membership
  const creator = item?.creator;
  const haveMembership =
    creator === currentMember.id ||
    item.memberships?.find(({ memberId }) => memberId === currentMember.id);

  return haveMembership;
};

export const redirectionReply = {
  headers: { 'content-type': 'application/json' },
  statusCode: StatusCodes.OK,
  body: null,
};

export const mockGetCurrentMember = (
  currentMember = MEMBERS.ANNA,
  shouldThrowError = false,
) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${GET_CURRENT_MEMBER_ROUTE}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          body: null,
        });
      }

      // might reply empty user when signed out
      return reply({ statusCode: StatusCodes.OK, body: currentMember });
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

export const mockGetSharedItems = ({ items, member }) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${SHARE_ITEM_WITH_ROUTE}`,
    },
    (req) => {
      const own = items.filter(({ creator }) => creator !== member.id);
      req.reply(own);
    },
  ).as('getSharedItems');
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
      query: { id: new RegExp(ID_FORMAT) },
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

export const mockGetItem = ({ items, currentMember }, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, itemId);

      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      if (shouldThrowError || !checkMembership({ item, currentMember })) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
      }

      return reply({
        body: item,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItem');
};

export const mockGetPublicItem = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetPublicItemRoute(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      const itemId = url.slice(API_HOST.length).split('/')[3];
      const item = getItemById(items, itemId);

      // item does not exist in db
      if (!item) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      // compute whether the item is public from own and parent's tags
      const isPublic = getParentsIdsFromPath(item?.path).some((id) => {
        const i = getItemById(items, id);
        return Boolean(
          i.tags?.find(({ tagId }) => tagId === ITEM_PUBLIC_TAG.id),
        );
      });
      if (!isPublic) {
        return reply({
          statusCode: StatusCodes.FORBIDDEN,
        });
      }

      return reply({
        body: item,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getPublicItem');
};

export const mockGetItems = ({ items, currentMember }, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items\\?id\\=`),
    },
    ({ url, reply }) => {
      const { id: itemIds } = qs.parse(url.slice(url.indexOf('?') + 1));
      return reply(
        itemIds.map((id) => {
          const item = getItemById(items, id);

          // mock membership
          const creator = item?.creator;
          const haveMembership =
            creator === currentMember.id ||
            item?.memberships?.find(
              ({ memberId }) => memberId === currentMember.id,
            );
          if (shouldThrowError || !haveMembership) {
            return { statusCode: StatusCodes.UNAUTHORIZED, body: null };
          }

          return (
            item || {
              statusCode: StatusCodes.NOT_FOUND,
            }
          );
        }),
      );
    },
  ).as('getItems');
};

export const mockGetChildren = ({ items, currentMember }) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetChildrenRoute(ID_FORMAT)}`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);

      if (!checkMembership({ item, currentMember })) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
      }

      const children = items.filter(isChild(id));
      return reply(children);
    },
  ).as('getChildren');
};

export const mockGetPublicChildren = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetPublicChildrenRoute(ID_FORMAT)}`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];

      const children = items.filter(isChild(id));
      return reply(children);
    },
  ).as('getPublicChildren');
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

export const mockMoveItems = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/items/move\\?id\\=`),
    },
    ({ url, reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      const ids = url
        .slice(API_HOST.length)
        .split('=')
        .splice(1)
        .map((x) => x.replace('&id', ''));

      const updated = ids.map((id) => getItemById(items, id));
      // actually update cached items
      for (const item of updated) {
        let path = transformIdForPath(item.id);
        if (body.parentId) {
          const parentItem = getItemById(items, body.parentId);
          path = `${parentItem.path}.${path}`;
        }
        item.path = path;
      }

      // todo: do for all children

      return reply({
        statusCode: StatusCodes.OK,
        body: updated, // this might not be accurate
      });
    },
  ).as('moveItems');
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

export const mockCopyItems = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/items/copy\\?id\\=`),
    },
    ({ url, reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }
      const ids = url
        .slice(API_HOST.length)
        .split('=')
        .splice(1)
        .map((x) => x.replace('&id', ''));
      const original = ids.map((id) => getItemById(items, id));
      const copies = [];
      for (const item of original) {
        const newId = uuidv4();
        // actually copy
        let path = transformIdForPath(newId);
        if (body.parentId) {
          const parentItem = getItemById(items, body.parentId);
          path = `${parentItem.path}.${path}`;
        }
        const newItem = { ...item, id: newId, path };
        items.push(newItem);
        copies.push(newItem);
      }
      // todo: do for all children
      return reply({
        statusCode: StatusCodes.OK,
        body: copies,
      });
    },
  ).as('copyItems');
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

export const mockGetMember = (members) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetMember(ID_FORMAT)}$`),
    },
    ({ url, reply }) => {
      const memberId = url.slice(API_HOST.length).split('/')[2];
      const member = getMemberById(members, memberId);

      // member does not exist in db
      if (!member) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }

      return reply({
        body: member,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getMember');
};

export const mockGetMemberBy = (members, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(buildGetMemberBy(EMAIL_FORMAT))}`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const emailReg = new RegExp(EMAIL_FORMAT);
      const mail = emailReg.exec(url)[0];
      const member = members.find(({ email }) => email === mail);

      return reply([member]);
    },
  ).as('getMemberBy');
};

export const mockEditMember = (members, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(`${API_HOST}/${buildPatchMember(ID_FORMAT)}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply('edit member');
    },
  ).as('editMember');
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
      url: new RegExp(`${API_HOST}/${buildDownloadFilesRoute(ID_FORMAT)}$`),
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
      url: `${AUTHENTICATION_HOST}/${buildSignInPath()}`,
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

export const mockPostItemLogin = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(
        `${API_HOST}/${buildPostItemLoginSignInRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, url, body }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      // check query match item login schema
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);
      const itemLoginSchema = getItemLoginSchema(item.extra);

      // provide either username or member id
      if (body.username) {
        expect(body).not.to.have.keys('memberId');
      } else if (body.memberId) {
        expect(body).not.to.have.keys('username');
      }

      // should have password if required
      if (
        itemLoginSchema ===
        SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.USERNAME_AND_PASSWORD
      ) {
        expect(body).to.have.keys('password');
      }

      reply({
        headers: { 'content-type': 'text/html' },
        statusCode: StatusCodes.OK,
      });
    },
  ).as('postItemLogin');
};

export const mockPutItemLogin = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_PUT.method,
      url: new RegExp(`${API_HOST}/${buildPutItemLoginSchema(ID_FORMAT)}$`),
    },
    ({ reply, url, body }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      // check query match item login schema
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);

      item.extra = buildItemLoginSchemaExtra(body.loginSchema);

      reply(item);
    },
  ).as('putItemLogin');
};

export const mockGetItemLogin = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemLoginRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);
      reply({ body: getItemLoginExtra(item?.extra), status: StatusCodes.OK });
    },
  ).as('getItemLogin');
};

export const mockGetItemMembershipsForItem = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildGetItemMembershipsForItemRoute(ID_FORMAT),
        )}$`,
      ),
    },
    ({ reply, url }) => {
      const { itemId } = qs.parse(url.slice(url.indexOf('?') + 1));
      const item = items.find(({ id }) => id === itemId);
      const result = item.memberships || [
        {
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: item.creator,
          itemId: item.id,
        },
      ];
      reply(result);
    },
  ).as('getItemMemberships');
};

export const mockEditItemMembershipForItem = (items) => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(
        `${API_HOST}/${buildEditItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, url }) => {
      const mId = url.slice(API_HOST.length).split('/')[2];
      const result = items.find(({ id }) => id === mId)?.memberships || [];
      reply(result?.find(({ id }) => id === mId));
    },
  ).as('editItemMembership');
};

export const mockDeleteItemMembershipForItem = (items) => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(
        `${API_HOST}/${buildDeleteItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, url }) => {
      const mId = url.slice(API_HOST.length).split('/')[2];
      const result = items.find(({ id }) => id === mId)?.memberships || [];
      reply(result?.find(({ id }) => id === mId));
    },
  ).as('deleteItemMembership');
};

export const mockGetItemTags = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemTagsRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const result = items.find(({ id }) => id === itemId).tags || [];
      reply(result);
    },
  ).as('getItemTags');
};

export const mockGetTags = (tags) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${parseStringToRegExp(GET_TAGS_ROUTE)}$`),
    },
    ({ reply }) => {
      reply(tags);
    },
  ).as('getTags');
};

export const mockPostItemTag = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildPostItemTagRoute(ID_FORMAT)}$`),
    },
    ({ reply, url, body }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);

      item.tags = [
        {
          tagId: ITEM_LOGIN_TAG.id,
          itemPath: item.path,
        },
      ];

      reply(body);
    },
  ).as('postItemTag');
};

export const mockGetFlags = (flags) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${parseStringToRegExp(GET_FLAGS_ROUTE)}$`),
    },
    ({ reply }) => {
      reply(flags);
    },
  ).as('getFlags');
};

export const mockPostItemFlag = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildPostItemFlagRoute(ID_FORMAT)}$`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('postItemFlag');
};

export const mockGetAppLink = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildAppItemLinkForTest()}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      const filepath = url.slice(API_HOST.length);
      return reply({ fixture: filepath });
    },
  ).as('getAppLink');
};

export const mockGetItemChat = ({ items }, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemChatRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);

      return reply({ id: itemId, messages: item?.chat });
    },
  ).as('getItemChat');
};

export const mockPostItemChatMessage = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(
        `${API_HOST}/${buildPostItemChatMessageRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      return reply(body);
    },
  ).as('postItemChatMessage');
};

export const mockAppApiAccessToken = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildAppApiAccessTokenRoute(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ token: 'token' });
    },
  ).as('appApiAccessToken');
};

export const mockGetAppData = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'get app data' });
    },
  ).as('getAppData');
};

export const mockPostAppData = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'post app data' });
    },
  ).as('postAppData');
};

export const mockDeleteAppData = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'delete app data' });
    },
  ).as('deleteAppData');
};

export const mockPatchAppData = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(`${API_HOST}/${buildGetAppData(ID_FORMAT)}$`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ data: 'patch app data' });
    },
  ).as('patchAppData');
};
