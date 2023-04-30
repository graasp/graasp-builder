import { StatusCodes } from 'http-status-codes';
import * as qs from 'qs';
import { v4 as uuidv4, v4 } from 'uuid';

import { API_ROUTES } from '@graasp/query-client';
import { App, Category, ChatMention, ItemTagType, ItemValidationGroup, ItemValidationReview, Member, PermissionLevel, RecycledItemData } from '@graasp/sdk';
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
} from '../../src/config/constants';
import {
  getItemById,
  isChild,
  isRootItem,
  transformIdForPath,
} from '../../src/utils/item';
import {
  buildItemLoginSchemaExtra,
} from '../../src/utils/itemExtra';
import { getMemberById } from '../../src/utils/member';
import {
  buildAppApiAccessTokenRoute,
  buildAppItemLinkForTest,
  buildGetAppData,
} from '../fixtures/apps';
import { buildInvitation } from '../fixtures/invitations';
import { CURRENT_USER, MEMBERS, } from '../fixtures/members';
import { ID_FORMAT, parseStringToRegExp } from './utils';
import { ItemForTest, MemberForTest } from './types';
import { AVATAR_LINK, ITEM_THUMBNAIL_LINK } from '../fixtures/thumbnails/links';

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
  buildGetItemLoginSchemaRoute,
  buildGetItemLoginSchemaTypeRoute,
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
  GET_RECYCLED_ITEMS_DATA_ROUTE,
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
  buildUpdateMemberPasswordRoute,
} = API_ROUTES;

const API_HOST = Cypress.env('API_HOST');

const checkMembership = ({ item, currentMember }) => {
  // mock membership
  const creator = item?.creator;
  const haveMembership =
    creator === currentMember.id ||
    item.memberships?.find(({ member }) => member.id === currentMember.id);

  return haveMembership;
};

export const redirectionReply = {
  headers: { 'content-type': 'application/json' },
  statusCode: StatusCodes.OK,
  body: null,
};

export const mockGetAppListRoute = (apps: App[]): void => {
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
): void => {
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

export const mockGetOwnItems = (items: ItemForTest[]): void => {
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

export const mockGetRecycledItems = (recycledItemData: RecycledItemData[]): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${GET_RECYCLED_ITEMS_DATA_ROUTE}`,
    },
    (req) => {
      req.reply(recycledItemData);
    },
  ).as('getRecycledItems');
};

export const mockGetSharedItems = ({ items, member }: { items: ItemForTest[], member: Member }): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${SHARED_ITEM_WITH_ROUTE}`,
    },
    (req) => {
      const own = items.filter(({ creator }) => creator.id !== member.id);
      req.reply(own);
    },
  ).as('getSharedItems');
};

export const mockPostItem = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

// export const mockDeleteItem = (items: ItemForTest[], shouldThrowError: boolean): void => {
//   cy.intercept(
//     {
//       method: DEFAULT_DELETE.method,
//       url: new RegExp(`${API_HOST}/${buildDeleteItemRoute(ID_FORMAT)}$`),
//     },
//     ({ url, reply }) => {
//       if (shouldThrowError) {
//         return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
//       }

//       const id = url.slice(API_HOST.length).split('/')[2];
//       return reply({
//         statusCode: StatusCodes.OK,
//         body: getItemById(items, id),
//       });
//     },
//   ).as('deleteItem');
// };

export const mockDeleteItems = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockRecycleItems = (items: ItemForTest[], shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/recycle\\?id\\=`),
      query: { id: new RegExp(ID_FORMAT) },
    },
    ({ url, reply }) => {
      let ids = qs.parse(url.slice(url.indexOf('?') + 1)).id as string | string[];
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

export const mockRestoreItems = (items: ItemForTest[], shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/restore\\?id\\=`),
      query: { id: new RegExp(ID_FORMAT) },
    },
    ({ url, reply }) => {
      let ids = qs.parse(url.slice(url.indexOf('?') + 1)).id as string | string[];
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

export const mockGetItem = ({ items, currentMember }: { items: ItemForTest[], currentMember: Member }, shouldThrowError: boolean): void => {
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

export const mockGetItems = ({ items, currentMember }: { items: ItemForTest[], currentMember: Member }): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}\\?id\\=`),
    },
    ({ url, reply }) => {
      let itemIds = qs.parse(url.slice(url.indexOf('?') + 1)).id as string[];
      if (!Array.isArray(itemIds)) {
        itemIds = [itemIds];
      }
      const result = { data: {}, errors: [] };
      itemIds.forEach((id) => {
        const item = getItemById(items, id);

        // mock membership
        const creator = item?.creator;
        const haveMembership =
          creator === currentMember.id ||
          item?.memberships?.find(
            ({ member }) => member.id === currentMember.id,
          );

        if (!haveMembership) {
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

export const mockGetChildren = ({ items, currentMember }: { items: ItemForTest[], currentMember: Member }): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      // TODO: use build url
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/children`),
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

export const mockMoveItems = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockCopyItems = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockEditItem = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockPostItemMembership = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockPostManyItemMemberships = (items: ItemForTest[], shouldThrowError: boolean): void => {
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
            ({ member }) => m.member.id === member.id,
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

export const mockGetMember = (members: Member[]): void => {
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

export const mockGetMembers = (members: Member[]): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: `${API_HOST}/${buildGetMembersRoute([''])}*`,
    },
    ({ url, reply }) => {
      let memberIds = qs.parse(url.slice(url.indexOf('?') + 1)).id as string[];
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

export const mockGetMembersBy = (members: Member[], shouldThrowError: boolean): void => {
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
      let emails = qs.parse(querystrings).email as string[];
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

export const mockEditMember = (members: Member[], shouldThrowError: boolean): void => {
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
export const mockUploadItem = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

      return reply();
    },
  ).as('uploadItem');
};

export const mockImportZip = (shouldThrowError: boolean): void => {
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

      return reply();
    },
  ).as('importZip');
};

export const mockDefaultDownloadFile = (items: ItemForTest[], shouldThrowError: boolean): void => {
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
        reply(readFilepath);
      } else {
        reply({ fixture: readFilepath });
      }
    },
  ).as('downloadFile');
};

export const mockSignInRedirection = (): void => {
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

export const mockSignOut = (): void => {
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

export const mockPostItemLogin = (items: ItemForTest[], shouldThrowError: boolean): void => {
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
      const itemLoginSchema = item.itemLoginSchema[0];

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

export const mockPutItemLoginSchema = (items: ItemForTest[], shouldThrowError: boolean): void => {
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
  ).as('putItemLoginSchema');
};

export const mockGetItemLogin = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(`${API_HOST}/${buildGetItemLoginSchemaRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);
      reply({
        body: item?.itemLoginSchema?.[0] ?? {},
        status: StatusCodes.OK,
      });
    },
  ).as('getItemLogin');
};

export const mockGetItemLoginSchema = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      // TODO: use build url
      url: new RegExp(
        `${API_HOST}/items/${ID_FORMAT}/login\\-schema$`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);
      const schema = item?.itemLoginSchema?.[0];
      if (!schema) {
        return reply({
          status: StatusCodes.NOT_FOUND,
        });
      }
      return reply({
        body: schema,
        status: StatusCodes.OK,
      });
    },
  ).as('getItemLoginSchema');
};

export const mockGetItemLoginSchemaType = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      url: new RegExp(
        `${API_HOST}/items/${ID_FORMAT}/login\\-schema\\-type$`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);

      const type = item?.itemLoginSchema?.[0]?.type;
      if (!type) {
        return reply({
          status: StatusCodes.NOT_FOUND,
        });
      }

      return reply({
        body: type,
        status: StatusCodes.OK,
      });
    },
  ).as('getItemLoginSchemaType');
};

export const mockGetItemMembershipsForItem = (items: ItemForTest[], currentMember: Member): void => {
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
      const itemId = qs.parse(url.slice(url.indexOf('?') + 1)).itemId as string;
      const selectedItems = items.filter(({ id }) => itemId.includes(id));
      // todo: use reduce
      const result = { data: {}, errors: [] }
      selectedItems.forEach(
        (item) => {
          const { creator, id, memberships } = item;
          // build default membership depending on current member
          // if the current member is the creator, it has membership
          // otherwise it should return an error
          const isCreator =
            creator.id === currentMember?.id

          // if the defined memberships does not contain currentMember, it should throw
          const currentMemberHasMembership = memberships?.find(
            ({ member }) => member.id === currentMember?.id,
          );
          // no membership
          if (!currentMemberHasMembership && !isCreator) {
            result.errors.push({ statusCode: StatusCodes.UNAUTHORIZED })
          }

          // return defined memberships or default membership
          result.data[id] = memberships || [
            {
              permission: PermissionLevel.Admin,
              member: creator,
              item,
            },
          ]

        },
      );
      reply(result);
    },
  ).as('getItemMemberships');
};

export const mockEditItemMembershipForItem = (): void => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(
        `${API_HOST}/${buildEditItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply }) => {
      // this mock intercept does nothing
      reply(1);
    },
  ).as('editItemMembership');
};

export const mockDeleteItemMembershipForItem = (): void => {
  cy.intercept(
    {
      method: DEFAULT_DELETE.method,
      url: new RegExp(
        `${API_HOST}/${buildDeleteItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply }) => {
      // this mock intercept does nothing
      reply(1);
    },
  ).as('deleteItemMembership');
};

export const mockGetItemTags = (items: ItemForTest[]): void => {
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

export const mockPostItemTag = (items: ItemForTest[], currentMember: Member, shouldThrowError: boolean): void => {

  // mock all tag type
  Object.values(ItemTagType).forEach(type => {
    cy.intercept(
      {
        method: DEFAULT_POST.method,
        url: new RegExp(`${API_HOST}/${buildPostItemTagRoute({ itemId: ID_FORMAT, type })}$`),
      },
      ({ reply, url, body }) => {
        if (shouldThrowError) {
          reply({ statusCode: StatusCodes.BAD_REQUEST });
          return;
        }
        const itemId = url.slice(API_HOST.length).split('/')[2];
        const item = items.find(({ id }) => itemId === id);

        // if (!item?.tags) {
        //   item.tags = [];
        // }
        // item.tags.push({
        //   id: v4(),
        //   // dynamic ???
        //   type: ItemTagType.HIDDEN,
        //   item,
        //   createdAt: new Date(),
        //   creator: currentMember
        // });
        reply(body);
      },
      // TODO
    ).as(`postItemTag-${type}`);
  })
};

export const mockDeleteItemTag = (shouldThrowError: boolean): void => {
  // mock all tag type
  Object.values(ItemTagType).forEach(type => {

    cy.intercept(
      {
        method: DEFAULT_DELETE.method,
        url: new RegExp(
          `${API_HOST}/${buildDeleteItemTagRoute({
            itemId: ID_FORMAT,
            type,
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
    ).as(`deleteItemTag-${type}`);
  }
  )
};

export const mockPostItemFlag = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockGetAppLink = (shouldThrowError: boolean): void => {
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

export const mockGetItemChat = ({ items }: { items: ItemForTest[] }, shouldThrowError: boolean): void => {
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

export const mockDownloadItemChat = ({ items }: { items: ItemForTest[] }, shouldThrowError: boolean): void => {
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
        creatorName: Object.values(MEMBERS).find((m) => m.id === c.creator.id)
          ?.name,
      }));
      return reply({
        id: itemId,
        messages,
      });
    },
  ).as('downloadItemChat');
};

export const mockPostItemChatMessage = (shouldThrowError: boolean): void => {
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

export const mockClearItemChat = ({ items }: { items: ItemForTest[] }, shouldThrowError: boolean): void => {
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

export const mockGetMemberMentions = ({ mentions }: { mentions: ChatMention[] }, shouldThrowError: boolean): void => {
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

export const mockAppApiAccessToken = (shouldThrowError: boolean): void => {
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

export const mockGetAppData = (shouldThrowError: boolean): void => {
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

export const mockPostAppData = (shouldThrowError: boolean): void => {
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

export const mockDeleteAppData = (shouldThrowError: boolean): void => {
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

export const mockPatchAppData = (shouldThrowError: boolean): void => {
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

export const mockGetItemThumbnail = (items: ItemForTest[], shouldThrowError: boolean): void => {
  // cy.intercept(
  //   {
  //     method: DEFAULT_GET.method,
  //     url: new RegExp(
  //       `${API_HOST}/${ITEMS_ROUTE}/${ID_FORMAT}/thumbnails/size`,
  //     ),
  //   },
  //   ({ reply, url }) => {
  //     if (shouldThrowError) {
  //       return reply({ statusCode: StatusCodes.BAD_REQUEST });
  //     }

  //     const [link, querystrings] = url.split('?');
  //     const id = link.slice(API_HOST.length).split('/')[3];
  //     const { size } = qs.parse(querystrings);

  //     const thumbnails = items.find(
  //       ({ id: thisId }) => id === thisId,
  //     )?.thumbnails;
  //     if (!thumbnails) {
  //       return reply({ statusCode: StatusCodes.NOT_FOUND });
  //     }
  //     return reply({
  //       fixture: `${thumbnails}/${size}`,
  //       headers: { 'content-type': THUMBNAIL_EXTENSION },
  //     });
  //   },
  // ).as('downloadItemThumbnail');
};

export const mockGetItemThumbnailUrl = (items: ItemForTest[], shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      // TODO: handle blob endpoint
      url: new RegExp(
        `${API_HOST}/${ITEMS_ROUTE}/${ID_FORMAT}/thumbnails`,
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
      return reply(ITEM_THUMBNAIL_LINK);
    },
  ).as('downloadItemThumbnailUrl');
};

export const mockPostItemThumbnail = (items: ItemForTest[], shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_POST.method,
      url: new RegExp(`${buildUploadItemThumbnailRoute(ID_FORMAT)}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.OK });
    },
  ).as('uploadItemThumbnail');
};

export const mockGetAvatarUrl = (members: MemberForTest[], shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_GET.method,
      // TODO: include all sizes
      url: new RegExp(
        `${API_HOST}/members/${ID_FORMAT}/avatar/small\\?replyUrl\\=true`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const [link, querystrings] = url.split('?');
      const id = link.slice(API_HOST.length).split('/')[2];
      const { size } = qs.parse(querystrings);

      const { thumbnails } = members.find(({ id: thisId }) => id === thisId) ?? {};
      if (!thumbnails) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      // TODO: REPLY URL
      return reply(AVATAR_LINK);
    },
  ).as('downloadAvatarUrl');
};

export const mockPostAvatar = (shouldThrowError: boolean): void => {
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

export const mockGetCategories = (categories: Category[], shouldThrowError: boolean): void => {
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

export const mockGetItemCategories = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockPostItemCategory = (shouldThrowError: boolean): void => {
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

export const mockDeleteItemCategory = (shouldThrowError: boolean): void => {
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


export const mockGetItemValidationAndReview = (itemValidationAndReview: ItemValidationReview): void => {
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

export const mockGetItemValidationGroups = (itemValidationGroups: ItemValidationGroup[]): void => {
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

export const mockPostItemValidation = (): void => {
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

export const mockPostInvitations = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockGetItemInvitations = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockResendInvitation = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockPatchInvitation = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockDeleteInvitation = (items: ItemForTest[], shouldThrowError: boolean): void => {
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

export const mockPublishItem = (items: ItemForTest[]): void => {
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

export const mockUpdatePassword = (members: Member[], shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: DEFAULT_PATCH.method,
      url: new RegExp(`${API_HOST}/${buildUpdateMemberPasswordRoute()}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply('update password');
    },
  ).as('updatePassword');
};
