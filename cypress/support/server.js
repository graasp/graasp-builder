import { StatusCodes } from 'http-status-codes';
import qs from 'querystring';
import { v4 as uuidv4, v4 } from 'uuid';

import { API_ROUTES } from '@graasp/query-client';
import { FAILURE_MESSAGES } from '@graasp/translations';

import {
  DEFAULT_DELETE,
  DEFAULT_GET,
  DEFAULT_PATCH,
  DEFAULT_POST,
  DEFAULT_PUT,
} from '../../src/api/utils';
import {
  SETTINGS,
  SIGN_IN_PATH,
  THUMBNAIL_EXTENSION,
} from '../../src/config/constants';
import {
  getItemById,
  isChild,
  isRootItem,
  transformIdForPath,
} from '../../src/utils/item';
import {
  buildItemLoginSchemaExtra,
  getItemLoginExtra,
} from '../../src/utils/itemExtra';
import { getMemberById } from '../../src/utils/member';
import {
  buildAppApiAccessTokenRoute,
  buildAppItemLinkForTest,
  buildGetAppData,
} from '../fixtures/apps';
import { PERMISSION_LEVELS } from '../fixtures/enum';
import { buildInvitation } from '../fixtures/invitations';
import { ITEM_LOGIN_TAG } from '../fixtures/itemTags';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import { ID_FORMAT, parseStringToRegExp } from './utils';

const {
  buildAppListRoute,
  buildDeleteItemRoute,
  buildEditItemRoute,
  buildGetChildrenRoute,
  buildGetItemRoute,
  buildPostItemRoute,
  GET_OWN_ITEMS_ROUTE,
  buildPostItemMembershipRoute,
  buildGetMember,
  buildPostManyItemMembershipsRoute,
  ITEMS_ROUTE,
  buildUploadFilesRoute,
  buildDownloadFilesRoute,
  GET_CURRENT_MEMBER_ROUTE,
  SIGN_OUT_ROUTE,
  buildPostItemLoginSignInRoute,
  buildGetItemLoginRoute,
  buildGetItemMembershipsForItemsRoute,
  buildGetItemTagsRoute,
  buildPutItemLoginSchemaRoute,
  buildPostItemTagRoute,
  buildPatchMember,
  SHARED_ITEM_WITH_ROUTE,
  buildEditItemMembershipRoute,
  buildDeleteItemMembershipRoute,
  buildPostItemFlagRoute,
  buildGetItemChatRoute,
  buildExportItemChatRoute,
  buildPostItemChatMessageRoute,
  buildClearItemChatRoute,
  GET_RECYCLED_ITEMS_ROUTE,
  buildDeleteItemTagRoute,
  buildDeleteItemsRoute,
  buildGetMembersRoute,
  buildUploadItemThumbnailRoute,
  buildUploadAvatarRoute,
  buildImportZipRoute,
  buildGetCategoriesRoute,
  buildPostItemCategoryRoute,
  buildDeleteItemCategoryRoute,
  buildPostInvitationsRoute,
  buildGetItemInvitationsForItemRoute,
  buildDeleteInvitationRoute,
  buildPatchInvitationRoute,
  buildResendInvitationRoute,
  buildItemPublishRoute,
  buildUpdateMemberPassword,
} = API_ROUTES;

const API_HOST = Cypress.env('API_HOST');

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

export const mockGetAppListRoute = (apps) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${buildAppListRoute}`,
    },
    (req) => {
      req.reply(apps);
    },
  ).as('getApps');
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

export const mockGetRecycledItems = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${GET_RECYCLED_ITEMS_ROUTE}`,
    },
    (req) => {
      req.reply(items);
    },
  ).as('getRecycledItems');
};

export const mockGetSharedItems = ({ items, member }) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${SHARED_ITEM_WITH_ROUTE}`,
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
      url: new RegExp(`${API_HOST}/${buildDeleteItemRoute(ID_FORMAT)}$`),
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
      url: new RegExp(`${API_HOST}/${buildDeleteItemsRoute([])}`),
    },
    ({ reply }) => {
      // const ids = qs.parse(url.slice(url.indexOf('?') + 1)).id;

      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      return reply({
        statusCode: StatusCodes.ACCEPTED,
      });
    },
  ).as('deleteItems');
};

export const mockRecycleItems = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/recycle\\?id\\=`),
      query: { id: new RegExp(ID_FORMAT) },
    },
    ({ url, reply }) => {
      let ids = qs.parse(url.slice(url.indexOf('?') + 1)).id;
      if (!Array.isArray(ids)) {
        ids = [ids];
      }

      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      return reply({
        statusCode: StatusCodes.ACCEPTED,
        // body: ids.map((id) => getItemById(items, id)),
      });
    },
  ).as('recycleItems');
};

export const mockRestoreItems = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/restore\\?id\\=`),
      query: { id: new RegExp(ID_FORMAT) },
    },
    ({ url, reply }) => {
      let ids = qs.parse(url.slice(url.indexOf('?') + 1)).id;
      if (!Array.isArray(ids)) {
        ids = [ids];
      }

      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      return reply({
        statusCode: StatusCodes.ACCEPTED,
        // body: ids.map((id) => getItemById(items, id)),
      });
    },
  ).as('restoreItems');
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

export const mockGetItems = ({ items, currentMember }, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}\\?id\\=`),
    },
    ({ url, reply }) => {
      const { id: itemIds } = qs.parse(url.slice(url.indexOf('?') + 1));

      const result = { data: {}, errors: [] };
      itemIds.forEach((id) => {
        const item = getItemById(items, id);

        // mock membership
        const creator = item?.creator;
        const haveMembership =
          creator === currentMember.id ||
          item?.memberships?.find(
            ({ memberId }) => memberId === currentMember.id,
          );

        if (shouldThrowError || !haveMembership) {
          result.errors.push({
            statusCode: StatusCodes.UNAUTHORIZED,
            body: null,
          });
        } else if (!item) {
          result.errors.push({ statusCode: StatusCodes.NOT_FOUND });
        } else {
          result.data[item.id] = item;
        }
      });

      return reply(result);
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

export const mockMoveItems = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/move\\?id\\=`),
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
        statusCode: StatusCodes.ACCEPTED,
      });
    },
  ).as('moveItems');
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
        statusCode: StatusCodes.ACCEPTED,
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

export const mockPostItemMembership = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildPostItemMembershipRoute(ID_FORMAT),
        )}`,
      ),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('postItemMembership');
};

export const mockPostManyItemMemberships = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(
        `${API_HOST}/${buildPostManyItemMembershipsRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, body, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      const itemId = url.split('/')[4];
      const itemMemberships = items.find(
        ({ id }) => id === itemId,
      )?.memberships;

      // return membership or error if membership
      // for member id already exists
      return reply(
        body.memberships.map((m) => {
          const thisM = itemMemberships?.find(
            ({ memberId }) => m.memberId === memberId,
          );
          if (thisM) {
            return {
              statusCode: StatusCodes.BAD_REQUEST,
              message: 'membership already exists',
              data: thisM,
            };
          }
          return m;
        }),
      );
    },
  ).as('postManyItemMemberships');
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

export const mockGetMembers = (members) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${buildGetMembersRoute([''])}*`,
    },
    ({ url, reply }) => {
      let { id: memberIds } = qs.parse(url.slice(url.indexOf('?') + 1));
      if (!Array.isArray(memberIds)) {
        memberIds = [memberIds];
      }

      const result = {
        data: {},
        errors: [],
      };

      memberIds?.forEach((id) => {
        const m = getMemberById(members, id);
        if (!m) {
          result.errors.push({
            statusCode: StatusCodes.NOT_FOUND,
            name: FAILURE_MESSAGES.MEMBER_NOT_FOUND,
          });
        } else {
          result.data[m.id] = m;
        }
      });

      return reply({
        body: result,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getMembers');
};

export const mockGetMembersBy = (members, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/members/search?email=*`,
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const querystrings = url.split('?')[1];
      let { email: emails } = qs.parse(querystrings);
      if (!Array.isArray(emails)) {
        emails = [emails];
      }

      // TODO
      const result = {
        data: {},
        errors: [],
      };
      emails.forEach((mail) => {
        members
          .filter(({ email }) => email === mail)
          .forEach((m) => {
            result.data[m.id] = m;
          });
      });

      return reply(result);
    },
  ).as('getMembersBy');
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
        )}$|${API_HOST}/${buildUploadFilesRoute()}`,
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

export const mockImportZip = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(buildImportZipRoute())}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(false);
    },
  ).as('importZip');
};

export const mockDefaultDownloadFile = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildDownloadFilesRoute(ID_FORMAT)}`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const { readFilepath } = items.find(({ id: thisId }) => id === thisId);
      const { replyUrl } = qs.parse(url.slice(url.indexOf('?') + 1));

      // either return the file url or the fixture data
      // info: we don't test fixture data anymore since the frontend uses url only
      if (replyUrl) {
        reply({ url: readFilepath });
      } else {
        reply({ fixture: readFilepath });
      }
    },
  ).as('downloadFile');
};

export const mockSignInRedirection = () => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: SIGN_IN_PATH,
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
      url: new RegExp(
        `${API_HOST}/${buildPutItemLoginSchemaRoute(ID_FORMAT)}$`,
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

      // todo: is it intentionnal to erase any extras present before ?
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
      reply({
        body: getItemLoginExtra(item?.extra) ?? {},
        status: StatusCodes.OK,
      });
    },
  ).as('getItemLogin');
};

export const mockGetItemMembershipsForItem = (items, currentMember) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildGetItemMembershipsForItemsRoute([]),
        )}`,
      ),
    },
    ({ reply, url }) => {
      const { itemId } = qs.parse(url.slice(url.indexOf('?') + 1));
      const selectedItems = items.filter(({ id }) => itemId.includes(id));
      const allMemberships = selectedItems.map(
        ({ creator, id, memberships }) => {
          // build default membership depending on current member
          // if the current member is the creator, it has membership
          // otherwise it should return an error
          const defaultMembership =
            creator === currentMember?.id
              ? [
                  {
                    permission: PERMISSION_LEVELS.ADMIN,
                    memberId: creator,
                    itemId: id,
                  },
                ]
              : { statusCode: StatusCodes.UNAUTHORIZED };

          // if the defined memberships does not contain currentMember, it should throw
          const currentMemberHasMembership = memberships?.find(
            ({ memberId }) => memberId === currentMember?.id,
          );
          if (!currentMemberHasMembership) {
            return defaultMembership;
          }

          return memberships || defaultMembership;
        },
      );
      reply(allMemberships);
    },
  ).as('getItemMemberships');
};

export const mockEditItemMembershipForItem = () => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(
        `${API_HOST}/${buildEditItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply }) => {
      // this mock intercept does nothing
      reply(true);
    },
  ).as('editItemMembership');
};

export const mockDeleteItemMembershipForItem = () => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(
        `${API_HOST}/${buildDeleteItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply }) => {
      // this mock intercept does nothing
      reply(true);
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
      const result = items.find(({ id }) => id === itemId)?.tags || [];
      reply(result);
    },
  ).as('getItemTags');
};

// export const mockGetTags = (tags) => {
//   cy.intercept(
//     {
//       method: DEFAULT_GET.method,
//       url: new RegExp(`${API_HOST}/${parseStringToRegExp(GET_TAGS_ROUTE)}$`),
//     },
//     ({ reply }) => {
//       reply(tags);
//     },
//   ).as('getTags');
// };

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

      if (!item?.tags) {
        item.tags = [];
      }
      item.tags.push({
        id: v4(),
        tagId: ITEM_LOGIN_TAG.id,
        itemPath: item.path,
      });
      reply(body);
    },
  ).as('postItemTag');
};

export const mockDeleteItemTag = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(
        `${API_HOST}/${buildDeleteItemTagRoute({
          id: ID_FORMAT,
          tagId: ID_FORMAT,
        })}$`,
      ),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      reply(body);
    },
  ).as('deleteItemTag');
};

// export const mockGetFlags = (flags) => {
//   cy.intercept(
//     {
//       method: DEFAULT_GET.method,
//       url: new RegExp(`${API_HOST}/${parseStringToRegExp(GET_FLAGS_ROUTE)}$`),
//     },
//     ({ reply }) => {
//       reply(flags);
//     },
//   ).as('getFlags');
// };

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
      url: new RegExp(`${API_HOST}/${buildAppItemLinkForTest()}`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const filepath = url.slice(API_HOST.length).split('?')[0];
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

export const mockDownloadItemChat = ({ items }, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildExportItemChatRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);

      const messages = item?.chat?.map((c) => ({
        ...c,
        creatorName: Object.values(MEMBERS).find((m) => m.id === c.creator)
          ?.name,
      }));
      return reply({
        id: itemId,
        messages,
      });
    },
  ).as('downloadItemChat');
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

export const mockClearItemChat = ({ items }, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(`${API_HOST}/${buildClearItemChatRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);
      return reply({ id: itemId, messages: item?.chat });
    },
  ).as('clearItemChat');
};

export const mockGetMemberMentions = ({ mentions }, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items/mentions`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ id: CURRENT_USER.id, mentions });
    },
  ).as('getMemberMentions');
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

export const mockGetItemThumbnail = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${ITEMS_ROUTE}/${ID_FORMAT}/thumbnails/size`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const [link, querystrings] = url.split('?');
      const id = link.slice(API_HOST.length).split('/')[3];
      const { size } = qs.parse(querystrings);

      const thumbnails = items.find(
        ({ id: thisId }) => id === thisId,
      )?.thumbnails;
      if (!thumbnails) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      return reply({
        fixture: `${thumbnails}/${size}`,
        headers: { 'content-type': THUMBNAIL_EXTENSION },
      });
    },
  ).as('downloadItemThumbnail');
};

export const mockGetItemThumbnailUrl = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${ITEMS_ROUTE}/${ID_FORMAT}/thumbnails/size?replyUrl=true`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const [link, querystrings] = url.split('?');
      const id = link.slice(API_HOST.length).split('/')[3];
      const { size } = qs.parse(querystrings);

      const thumbnails = items.find(
        ({ id: thisId }) => id === thisId,
      )?.thumbnails;
      if (!thumbnails) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      // TODO: RETURN URL
      return reply({
        fixture: `${thumbnails}/${size}`,
        headers: { 'content-type': THUMBNAIL_EXTENSION },
      });
    },
  ).as('downloadItemThumbnailUrl');
};

export const mockPostItemThumbnail = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${buildUploadItemThumbnailRoute()}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.OK });
    },
  ).as('uploadItemThumbnail');
};

export const mockGetAvatar = (members, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/members/avatars/${ID_FORMAT}/download\\?size\\=`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const [link, querystrings] = url.split('?');
      const id = link.slice(API_HOST.length).split('/')[3];
      const { size } = qs.parse(querystrings);

      const { thumbnails } = members.find(({ id: thisId }) => id === thisId);
      if (!thumbnails) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }

      return reply({
        fixture: `${thumbnails}/${size}.jpeg`,
        headers: { 'content-type': THUMBNAIL_EXTENSION },
      });
    },
  ).as('downloadAvatar');
};

export const mockGetAvatarUrl = (members, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/members/${ID_FORMAT}/avatar/size\\?replyUrl\\=true`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const [link, querystrings] = url.split('?');
      const id = link.slice(API_HOST.length).split('/')[3];
      const { size } = qs.parse(querystrings);

      const { thumbnails } = members.find(({ id: thisId }) => id === thisId);
      if (!thumbnails) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      // TODO: REPLY URL
      return reply({
        fixture: `${thumbnails}/${size}.jpeg`,
        headers: { 'content-type': THUMBNAIL_EXTENSION },
      });
    },
  ).as('downloadAvatarUrl');
};

export const mockPostAvatar = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${buildUploadAvatarRoute()}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.OK });
    },
  ).as('uploadAvatar');
};

export const mockGetCategories = (categories, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(buildGetCategoriesRoute())}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }
      reply(categories);
    },
  ).as('getCategories');
};

export const mockGetItemCategories = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/categories`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const result = items.find(({ id }) => id === itemId)?.categories || [];
      return reply(result);
    },
  ).as('getItemCategories');
};

export const mockPostItemCategory = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildPostItemCategoryRoute(ID_FORMAT)}$`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('postItemCategory');
};

export const mockDeleteItemCategory = (shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(
        `${API_HOST}/${buildDeleteItemCategoryRoute({
          itemId: ID_FORMAT,
          itemCategoryId: ID_FORMAT,
        })}$`,
      ),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('deleteItemCategory');
};

export const mockGetItemValidationReviewStatuses = (iVRStatuses) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items/validations/review/statuses`),
    },
    ({ reply }) => {
      reply(iVRStatuses);
    },
  ).as('getItemValidationReviewStatuses');
};

export const mockGetItemValidationAndReview = (itemValidationAndReview) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items/validations/status/${ID_FORMAT}`),
    },
    ({ reply }) => {
      reply(itemValidationAndReview);
    },
  ).as('getItemValidationAndReview');
};

export const mockGetItemValidationGroups = (itemValidationGroups) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/items/validations/groups/${ID_FORMAT}`),
    },
    ({ reply }) => {
      reply(itemValidationGroups);
    },
  ).as('getItemValidationGroups');
};

export const mockPostItemValidation = () => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/items/validations/${ID_FORMAT}`),
    },
    ({ reply, body }) => {
      reply(body);
    },
  ).as('postItemValidation');
};

export const mockPostInvitations = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${buildPostInvitationsRoute(ID_FORMAT)}`),
    },
    ({ reply, body, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.split('/')[4];
      const invitations = items.find(({ id }) => id === itemId)?.invitations;

      return reply(
        body.invitations.map((inv) => {
          const thisInv = invitations?.find(({ email }) => email === inv.email);
          if (thisInv) {
            return {
              statusCode: StatusCodes.BAD_REQUEST,
              message: 'An invitation already exists for this email',
              data: inv,
            };
          }
          return buildInvitation(inv);
        }),
      );
    },
  ).as('postInvitations');
};

export const mockGetItemInvitations = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/${buildGetItemInvitationsForItemRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => id === itemId);
      const invitations = item?.invitations ?? [];

      return reply(invitations);
    },
  ).as('getInvitationsForItem');
};

export const mockResendInvitation = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildResendInvitationRoute({ itemId: ID_FORMAT, id: ID_FORMAT }),
        )}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.NO_CONTENT });
    },
  ).as('resendInvitation');
};

export const mockPatchInvitation = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(
        `${API_HOST}/${buildPatchInvitationRoute({
          itemId: ID_FORMAT,
          id: ID_FORMAT,
        })}`,
      ),
    },
    ({ reply, body, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const invitationId = url.slice(API_HOST.length).split('/')[4];
      const item = items.find(({ id }) => id === itemId);
      const invitation = item?.invitations?.find(
        ({ id }) => id === invitationId,
      );
      const newInvitation = { ...invitation, ...body };
      return reply(newInvitation);
    },
  ).as('patchInvitation');
};

export const mockDeleteInvitation = (items, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(
        `${API_HOST}/${buildDeleteInvitationRoute({
          itemId: ID_FORMAT,
          id: ID_FORMAT,
        })}`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const invitationId = url.slice(API_HOST.length).split('/')[4];
      const item = items.find(({ id }) => id === itemId);
      const invitation = item?.invitations?.find(
        ({ id }) => id === invitationId,
      );
      return reply(invitation);
    },
  ).as('deleteInvitation');
};

export const mockPublishItem = (items) => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildItemPublishRoute(ID_FORMAT)}`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      reply(items.find((item) => item?.id === itemId));
    },
  ).as('publishItem');
};

export const mockUpdatePassword = (members, shouldThrowError) => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(`${API_HOST}/${buildUpdateMemberPassword}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply('update password');
    },
  ).as('updatePassword');
};
