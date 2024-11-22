import { API_ROUTES } from '@graasp/query-client';
import {
  AccountType,
  App,
  Category,
  ChatMention,
  CompleteMembershipRequest,
  DiscriminatedItem,
  HttpMethod,
  Invitation,
  ItemBookmark,
  ItemMembership,
  ItemPublished,
  ItemValidationGroup,
  ItemVisibilityType,
  Member,
  PermissionLevel,
  PermissionLevelCompare,
  PublicationStatus,
  RecycledItemData,
  ShortLink,
  ShortLinksOfItem,
  buildPathFromIds,
  getIdsFromPath,
  isRootItem,
} from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4, v4 } from 'uuid';

import { ITEM_PAGE_SIZE, SETTINGS } from '../../src/config/constants';
import { getMemberById } from '../../src/utils/member';
import {
  buildAppApiAccessTokenRoute,
  buildAppItemLinkForTest,
  buildGetAppData,
} from '../fixtures/apps';
import { buildInvitation } from '../fixtures/invitations';
import { CURRENT_USER, MEMBERS } from '../fixtures/members';
import { AVATAR_LINK, ITEM_THUMBNAIL_LINK } from '../fixtures/thumbnails/links';
import { SIGN_IN_PATH } from './paths';
import { ItemForTest, MemberForTest } from './types';
import {
  ID_FORMAT,
  SHORTLINK_FORMAT,
  extractItemIdOrThrow,
  getItemById,
  parseStringToRegExp,
} from './utils';

const {
  buildGetItemPublishedInformationRoute,
  buildAppListRoute,
  buildGetLastItemValidationGroupRoute,
  buildEditItemRoute,
  buildItemUnpublishRoute,
  buildGetItemRoute,
  buildGetMemberRoute,
  buildPostManyItemMembershipsRoute,
  ITEMS_ROUTE,
  buildUploadFilesRoute,
  buildDownloadFilesRoute,
  buildGetCurrentMemberRoute,
  GET_BOOKMARKED_ITEMS_ROUTE,
  SIGN_OUT_ROUTE,
  buildPostItemLoginSignInRoute,
  buildGetItemLoginSchemaRoute,
  buildGetItemMembershipsForItemsRoute,
  buildPostItemVisibilityRoute,
  buildPatchCurrentMemberRoute,
  buildEditItemMembershipRoute,
  buildDeleteItemMembershipRoute,
  buildPostItemFlagRoute,
  buildGetItemChatRoute,
  buildExportItemChatRoute,
  buildPostItemChatMessageRoute,
  buildClearItemChatRoute,
  buildDeleteItemVisibilityRoute,
  buildDeleteItemsRoute,
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
  buildPostUserCSVUploadWithTemplateRoute,
  buildResendInvitationRoute,
  buildPostUserCSVUploadRoute,
  buildGetPublishedItemsForMemberRoute,
  buildItemPublishRoute,
  buildGetPublicationStatusRoute,
  buildPatchMemberPasswordRoute,
  buildPostItemValidationRoute,
  buildGetShortLinkAvailableRoute,
  buildGetShortLinksItemRoute,
  buildPostShortLinkRoute,
  buildPatchShortLinkRoute,
  buildDeleteShortLinkRoute,
  buildDeleteItemThumbnailRoute,
  buildImportH5PRoute,
} = API_ROUTES;

const API_HOST = Cypress.env('VITE_GRAASP_API_HOST');

const checkMembership = ({
  item,
}: {
  item: ItemForTest;
  currentMember: Member;
  // eslint-disable-next-line arrow-body-style
}) => {
  // todo: public
  // TODO!!!
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return PermissionLevelCompare.gte(item.permission, PermissionLevel.Read);
};

export const redirectionReply = {
  headers: { 'content-type': 'application/json' },
  statusCode: StatusCodes.OK,
};

export const mockGetAppListRoute = (apps: App[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
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
      method: HttpMethod.Get,
      url: `${API_HOST}/${buildGetCurrentMemberRoute()}`,
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

export const mockGetAccessibleItems = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      pathname: `/${ITEMS_ROUTE}/accessible`,
    },
    ({ url, reply }) => {
      const params = new URL(url).searchParams;

      const page = parseInt(params.get('page') ?? '1', 10);
      const pageSize = parseInt(params.get('pageSize') ?? '10', 10);

      // as { page: number; pageSize: number };

      // warning: we don't check memberships
      const root = items.filter(isRootItem);

      // todo: filter

      const result = root.slice((page - 1) * pageSize, page * pageSize);

      reply({ data: result, totalCount: root.length });
    },
  ).as('getAccessibleItems');
};

export const mockGetOwnRecycledItemData = (
  recycledItemData: RecycledItemData[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      pathname: `/items/recycled`,
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      const params = new URL(url).searchParams;

      const page = parseInt(params.get('page') ?? '1', 10);
      const pageSize = parseInt(params.get('pageSize') ?? '10', 10);

      const result = recycledItemData.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );

      reply({
        data: result.map(({ item }) => item),
        totalCount: recycledItemData.length,
        pagination: { page: 1, pageSize: ITEM_PAGE_SIZE },
      });
    },
  ).as('getOwnRecycledItemData');
};

export const mockPostItem = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/items\\?parentId|${API_HOST}/items$`),
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
        path: buildPathFromIds(id),
        creator: CURRENT_USER.id,
      });
    },
  ).as('postItem');
};

export const mockDeleteItems = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/${buildDeleteItemsRoute([])}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      return reply({
        statusCode: StatusCodes.ACCEPTED,
      });
    },
  ).as('deleteItems');
};

export const mockRecycleItems = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/recycle\\?id\\=`),
      query: { id: new RegExp(ID_FORMAT) },
    },
    ({ reply }) => {
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

export const mockRestoreItems = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/restore\\?id\\=`),
      query: { id: new RegExp(ID_FORMAT) },
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST, body: null });
      }

      return reply({
        statusCode: StatusCodes.ACCEPTED,
      });
    },
  ).as('restoreItems');
};

export const mockGetItem = (
  { items, currentMember }: { items: ItemForTest[]; currentMember: Member },
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
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

      if (shouldThrowError) {
        return reply({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
      }

      if (item.public) {
        return reply({
          body: item,
          statusCode: StatusCodes.OK,
        });
      }

      if (!checkMembership({ item, currentMember })) {
        if (!currentMember) {
          return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
        }
        return reply({ statusCode: StatusCodes.FORBIDDEN, body: null });
      }

      return reply({
        body: item,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItem');
};

export const mockGetItems = ({
  items,
  currentMember,
}: {
  items: ItemForTest[];
  currentMember: Member;
}): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}\\?id\\=`),
    },
    ({ url, reply }) => {
      const search = new URL(url).searchParams;
      const itemIds = search.getAll('id');
      const result: {
        data: { [key: string]: ItemForTest };
        errors: { statusCode: number }[];
      } = { data: {}, errors: [] };
      itemIds.forEach((id) => {
        const item = getItemById(items, id);

        const haveMembership = checkMembership({ item, currentMember });

        if (!haveMembership) {
          result.errors.push({
            statusCode: StatusCodes.UNAUTHORIZED,
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

export const mockGetChildren = ({
  items,
  currentMember,
}: {
  items: ItemForTest[];
  currentMember: Member;
}): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      // TODO: use build url
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/children`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);
      const itemDepthLevel = getIdsFromPath(item.path).length;
      const children = items.filter(
        (elem) =>
          // should be a descendant of the the item
          elem.path.startsWith(item.path) &&
          // should be a direct child
          getIdsFromPath(elem.path).length === itemDepthLevel + 1,
      );
      if (item.public) {
        return reply(children);
      }

      if (!checkMembership({ item, currentMember })) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
      }
      return reply(children);
    },
  ).as('getChildren');
};

export const mockGetParents = ({
  items,
  currentMember,
}: {
  items: ItemForTest[];
  currentMember: Member;
}): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      // TODO: use build url
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/parents`),
    },
    ({ url, reply }) => {
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);

      if (!checkMembership({ item, currentMember })) {
        return reply({ statusCode: StatusCodes.UNAUTHORIZED, body: null });
      }

      // remove 36 from uuid and 1 for the dot
      const parents = items.filter(
        (i) =>
          item?.path.includes(i.path) &&
          i.path.length === (item?.path.length || 0) - 37,
      );
      return reply(parents);
    },
  ).as('getParents');
};

export const mockMoveItems = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
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
        let path = buildPathFromIds(item.id);
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

export const mockCopyItems = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
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
        let path = buildPathFromIds(newId);
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

export const mockEditItem = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
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

export const mockPostItemMembership = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: `${API_HOST}/item-memberships?*`,
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('postItemMembership');
};

export const mockPostManyItemMemberships = (
  args: { items: ItemForTest[]; members: MemberForTest[] },
  shouldThrowError: boolean,
): void => {
  const { items, members } = args;
  cy.intercept(
    {
      method: HttpMethod.Post,
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
      const result: {
        data: {
          [key: string]: {
            permission: PermissionLevel;
            member: Member;
            item: DiscriminatedItem;
          };
        };
        errors: { statusCode: number; message: string; data: unknown }[];
      } = { data: {}, errors: [] };

      body.memberships.forEach(
        (m: {
          itemPath: string;
          permission: PermissionLevel;
          memberId: string;
        }) => {
          const thisM = itemMemberships?.find(
            ({ account }) => m.memberId === account.id,
          );
          if (thisM) {
            result.errors.push({
              statusCode: StatusCodes.BAD_REQUEST,
              message: 'membership already exists',
              data: thisM,
            });
          }
          result.data[m.memberId] = {
            permission: m.permission,
            member: members?.find(({ id }) => m.memberId === id),
            item: items?.find(({ path }) => m.itemPath === path),
          };
        },
      );
      return reply(result);
    },
  ).as('postManyItemMemberships');
};

export const mockGetMember = (members: Member[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetMemberRoute(ID_FORMAT)}$`),
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

export const mockEditMember = (
  _members: Member[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(`${API_HOST}/${buildPatchCurrentMemberRoute()}`),
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
export const mockUploadItem = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
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
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(buildImportZipRoute())}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.ACCEPTED });
    },
  ).as('importZip');
};

export const mockImportH5p = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(buildImportH5PRoute())}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.ACCEPTED });
    },
  ).as('importH5p');
};

export const mockDefaultDownloadFile = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildDownloadFilesRoute(ID_FORMAT)}`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      const id = url.slice(API_HOST.length).split('/')[2];
      const { readFilepath } = items.find(({ id: thisId }) => id === thisId);
      const replyUrl = new URL(url).searchParams.get('replyUrl');

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
      method: HttpMethod.Get,
      pathname: new URL(SIGN_IN_PATH).pathname,
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('signInRedirection');
};

export const mockSignOut = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(SIGN_OUT_ROUTE),
    },
    ({ reply }) => {
      reply(redirectionReply);
    },
  ).as('signOut');
};

export const mockPostItemLogin = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
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
      const { itemLoginSchema } = item;

      // provide either username or member id
      if (body.username) {
        expect(body).not.to.have.keys('memberId');
      } else if (body.memberId) {
        expect(body).not.to.have.keys('username');
      }

      // should have password if required
      if (
        itemLoginSchema.type ===
        SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.USERNAME_AND_PASSWORD
      ) {
        expect(body).to.have.any.keys('password');
      }

      reply({
        headers: { 'content-type': 'text/html' },
        statusCode: StatusCodes.OK,
      });
    },
  ).as('postItemLogin');
};

export const mockPutItemLoginSchema = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Put,
      // TODO: use build url
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/login-schema$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        reply({ statusCode: StatusCodes.BAD_REQUEST });
        return;
      }

      // check query match item login schema
      const id = url.slice(API_HOST.length).split('/')[2];
      const item = getItemById(items, id);

      reply(item);
    },
  ).as('putItemLoginSchema');
};

export const mockDeleteItemLoginSchema = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/login-schema$`),
    },
    ({ reply, url }) => {
      // check query match item login schema
      const id = url.slice(API_HOST.length).split('/')[2];

      reply(id);
    },
  ).as('deleteItemLoginSchema');
};

export const mockGetItemLogin = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetItemLoginSchemaRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);
      reply({
        body: item?.itemLoginSchema ?? {},
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItemLogin');
};

export const mockGetItemLoginSchema = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      // TODO: use build url
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/login\\-schema$`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);
      const schema = item?.itemLoginSchema;
      if (!schema) {
        return reply({
          statusCode: StatusCodes.NOT_FOUND,
        });
      }
      return reply({
        body: schema,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItemLoginSchema');
};

export const mockGetItemLoginSchemaType = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/login\\-schema\\-type$`),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);

      // if no item login schema is defined, the backend returns null
      return reply({
        body: item?.itemLoginSchema?.type ?? null,
        statusCode: StatusCodes.OK,
      });
    },
  ).as('getItemLoginSchemaType');
};

export const mockGetItemMembershipsForItem = (
  items: ItemForTest[],
  currentMember: Member,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${parseStringToRegExp(
          buildGetItemMembershipsForItemsRoute([]),
        )}`,
      ),
    },
    ({ reply, url }) => {
      const itemId = new URL(url).searchParams.get('itemId');
      const selectedItems = items.filter(({ id }) => itemId.includes(id));
      // todo: use reduce
      const result: {
        data: {
          [key: string]: ItemMembership[];
        };
        errors: { statusCode: number }[];
      } = { data: {}, errors: [] };
      selectedItems.forEach((item) => {
        const { creator, id, memberships } = item;
        // build default membership depending on current member
        // if the current member is the creator, it has membership
        // otherwise it should return an error
        const isCreator = creator.id === currentMember?.id;

        // if the defined memberships does not contain currentMember, it should throw
        const currentMemberHasMembership = memberships?.find(
          ({ account }) => account.id === currentMember?.id,
        );
        // no membership
        if (!currentMemberHasMembership && !isCreator) {
          result.errors.push({ statusCode: StatusCodes.UNAUTHORIZED });
        }

        // return defined memberships or default membership
        result.data[id] = memberships || [
          {
            permission: PermissionLevel.Admin,
            account: { ...creator, type: AccountType.Individual },
            item,
            id: v4(),
            createdAt: '2021-08-11T12:56:36.834Z',
            updatedAt: '2021-08-11T12:56:36.834Z',
          },
        ];
      });
      reply(result);
    },
  ).as('getItemMemberships');
};

export const mockEditItemMembershipForItem = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(
        `${API_HOST}/${buildEditItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply }) => {
      // this mock intercept does nothing
      reply('true');
    },
  ).as('editItemMembership');
};

export const mockDeleteItemMembershipForItem = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(
        `${API_HOST}/${buildDeleteItemMembershipRoute(ID_FORMAT)}$`,
      ),
    },
    ({ reply }) => {
      // this mock intercept does nothing
      reply('true');
    },
  ).as('deleteItemMembership');
};

export const mockPostItemVisibility = (
  items: ItemForTest[],
  currentMember: Member,
  shouldThrowError: boolean,
): void => {
  // mock all tag type
  Object.values(ItemVisibilityType).forEach((type) => {
    cy.intercept(
      {
        method: HttpMethod.Post,
        url: new RegExp(
          `${API_HOST}/${buildPostItemVisibilityRoute({ itemId: ID_FORMAT, type })}$`,
        ),
      },
      ({ reply, url, body }) => {
        if (shouldThrowError) {
          reply({ statusCode: StatusCodes.BAD_REQUEST });
          return;
        }
        const itemId = url.slice(API_HOST.length).split('/')[2];
        const tagType = url
          .slice(API_HOST.length)
          .split('/')[4] as ItemVisibilityType;
        const item = items.find(({ id }) => itemId === id);

        if (!item?.visibilities) {
          item.visibilities = [];
        }
        item.visibilities.push({
          id: v4(),
          type: tagType,
          // avoid circular dependency
          item: { id: item.id, path: item.path } as DiscriminatedItem,
          createdAt: '2021-08-11T12:56:36.834Z',
          creator: currentMember,
        });
        reply(body);
      },
    ).as(`postItemVisibility-${type}`);
  });
};

export const mockDeleteItemVisibility = (shouldThrowError: boolean): void => {
  // mock all tag type
  Object.values(ItemVisibilityType).forEach((type) => {
    cy.intercept(
      {
        method: HttpMethod.Delete,
        url: new RegExp(
          `${API_HOST}/${buildDeleteItemVisibilityRoute({
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
    ).as(`deleteItemVisibility-${type}`);
  });
};

export const mockPostItemFlag = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
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
      method: HttpMethod.Get,
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

export const mockGetItemChat = (
  { items }: { items: ItemForTest[] },
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetItemChatRoute(ID_FORMAT)}$`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.slice(API_HOST.length).split('/')[2];
      const item = items.find(({ id }) => itemId === id);

      return reply(item?.chat ?? []);
    },
  ).as('getItemChat');
};

export const mockDownloadItemChat = (
  { items }: { items: ItemForTest[] },
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
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
      method: HttpMethod.Post,
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

export const mockClearItemChat = (
  { items }: { items: ItemForTest[] },
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
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

export const mockGetMemberMentions = (
  { mentions }: { mentions: ChatMention[] },
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/mentions`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(mentions);
    },
  ).as('getMemberMentions');
};

export const mockAppApiAccessToken = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
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
      method: HttpMethod.Get,
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
      method: HttpMethod.Post,
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
      method: HttpMethod.Delete,
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
      method: HttpMethod.Patch,
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

export const mockGetItemThumbnail = (): void => {
  // cy.intercept(
  //   {
  //     method: HttpMethod.GET,
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

export const mockGetItemThumbnailUrl = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      // TODO: handle blob endpoint
      url: new RegExp(`${API_HOST}/${ITEMS_ROUTE}/${ID_FORMAT}/thumbnails`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const [link] = url.split('?');
      const id = link.slice(API_HOST.length).split('/')[2];

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

export const mockPostItemThumbnail = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
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

export const mockDeleteItemThumbnail = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${buildDeleteItemThumbnailRoute(ID_FORMAT)}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply({ statusCode: StatusCodes.NO_CONTENT });
    },
  ).as('deleteItemThumbnail');
};

export const mockGetAvatarUrl = (
  members: MemberForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      // TODO: include all sizes
      url: new RegExp(
        `${API_HOST}/members/${ID_FORMAT}/avatar/small\\?replyUrl\\=true`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const [link] = url.split('?');
      const id = link.slice(API_HOST.length).split('/')[2];

      const { thumbnails } =
        members.find(({ id: thisId }) => id === thisId) ?? {};
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
      method: HttpMethod.Post,
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

export const mockGetCategories = (
  categories: Category[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
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

export const mockGetItemCategories = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
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
      method: HttpMethod.Post,
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
      method: HttpMethod.Delete,
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

export const mockGetItemValidationGroups = (
  itemValidationGroups: ItemValidationGroup[],
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
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
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildPostItemValidationRoute(ID_FORMAT)}`),
    },
    ({ reply, body }) => {
      reply(body);
    },
  ).as('postItemValidation');
};

export const mockPostInvitations = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildPostInvitationsRoute(ID_FORMAT)}`),
    },
    ({ reply, body, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const itemId = url.split('/')[4];
      const invitations = items.find(({ id }) => id === itemId)?.invitations;

      const result: {
        data: { [key: string]: Invitation };
        errors: { statusCode: number; message: string; data: unknown }[];
      } = {
        data: {},
        errors: [],
      };
      body.invitations.forEach((inv: Parameters<typeof buildInvitation>[0]) => {
        const thisInv = invitations?.find(({ email }) => email === inv.email);
        if (thisInv) {
          result.errors.push({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'An invitation already exists for this email',
            data: inv,
          });
        } else {
          result.data[inv.email] = buildInvitation(inv);
        }
      });
      return reply(result);
    },
  ).as('postInvitations');
};

export const mockGetItemInvitations = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
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

export const mockResendInvitation = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
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

export const mockPatchInvitation = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
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

export const mockDeleteInvitation = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
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

export const mockUploadInvitationCSV = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildPostUserCSVUploadRoute(ID_FORMAT)}`),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      const itemId = url.split('/').at(-3);
      const item = items.find(({ id }) => id === itemId);
      return reply({ memberships: item.memberships });
    },
  ).as('uploadCSV');
};
export const mockUploadInvitationCSVWithTemplate = (
  items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(
        `${API_HOST}/${buildPostUserCSVUploadWithTemplateRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }
      return reply([{ groupName: 'A', memberships: [], invitations: [] }]);
    },
  ).as('uploadCSVWithTemplate');
};

export const mockGetPublicationStatus = (status: PublicationStatus): void => {
  const interceptingPathFormat = buildGetPublicationStatusRoute(ID_FORMAT);
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${interceptingPathFormat}`),
    },
    ({ reply }) => reply(status),
  ).as('getPublicationStatus');
};

export const mockPublishItem = (items: ItemForTest[]): void => {
  const interceptingPathFormat = buildItemPublishRoute(ID_FORMAT);
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${interceptingPathFormat}`),
    },
    ({ reply, url }) => {
      const itemId = extractItemIdOrThrow(interceptingPathFormat, new URL(url));
      const searchItem = items.find((item) => item?.id === itemId);

      if (!searchItem) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }

      return reply(searchItem);
    },
  ).as('publishItem');
};

export const mockUnpublishItem = (items: ItemForTest[]): void => {
  const interceptingPathFormat = buildItemUnpublishRoute(ID_FORMAT);
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/${interceptingPathFormat}`),
    },
    ({ reply, url }) => {
      const itemId = extractItemIdOrThrow(interceptingPathFormat, new URL(url));
      const searchItem = items.find((item) => item?.id === itemId);

      if (!searchItem) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }

      return reply(searchItem);
    },
  ).as('unpublishItem');
};

export const mockGetPublishItemInformations = (items: ItemForTest[]): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetItemPublishedInformationRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[3];
      const item = items.find((i) => i?.id === itemId);
      if (!item?.published) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      return reply({ item });
    },
  ).as('getPublishItemInformations');
};

export const mockGetPublishItemsForMember = (
  publishedItemData: ItemPublished[],
  shoulThrow = false,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetPublishedItemsForMemberRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      if (shoulThrow) {
        return reply({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR });
      }

      const memberId = url.slice(API_HOST.length).split('/')[4];
      const published = publishedItemData
        .filter((p) => p.item.creator.id === memberId)
        .map((i) => i.item);
      return reply(published);
    },
  ).as('getPublishedItemsForMember');
};

export const mockGetLatestValidationGroup = (
  _items: ItemForTest[],
  itemValidationGroups: ItemValidationGroup[],
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetLastItemValidationGroupRoute(ID_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      const itemId = url.slice(API_HOST.length).split('/')[2];

      const validationGroup = itemValidationGroups?.find(
        (ivg) => ivg.item.id === itemId,
      );

      if (!validationGroup) {
        return reply({ statusCode: StatusCodes.NOT_FOUND });
      }
      // TODO: should be dynamic and include failure
      // const validationGroup: ItemValidationGroup = { id: v4(), item, createdAt: '2021-08-11T12:56:36.834Z', itemValidations: [{ item, status: ItemValidationStatus.Success, id: v4(), process: ItemValidationProcess.BadWordsDetection, result: '', createdAt: '2021-08-11T12:56:36.834Z', updatedAt: new Date() }] as ItemValidation[] }
      // TODO: get latest

      return reply(validationGroup);
    },
  ).as('getLatestValidationGroup');
};

export const mockUpdatePassword = (
  _members: Member[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(`${API_HOST}/${buildPatchMemberPasswordRoute()}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply('update password');
    },
  ).as('updatePassword');
};

export const mockGetItemFavorites = (
  itemFavorites: ItemBookmark[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: `${API_HOST}/${GET_BOOKMARKED_ITEMS_ROUTE}`,
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(itemFavorites);
    },
  ).as('getFavoriteItems');
};

export const mockAddFavorite = (
  _items: ItemForTest[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${GET_BOOKMARKED_ITEMS_ROUTE}/${ID_FORMAT}`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('bookmarkItem');
};

export const mockDeleteFavorite = (shouldThrowError: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(`${API_HOST}/${GET_BOOKMARKED_ITEMS_ROUTE}/${ID_FORMAT}`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(body);
    },
  ).as('unbookmarkItem');
};

// Intercept ShortLinks calls
export const mockGetShortLinksItem = (
  itemId: string,
  shortLinks: ShortLink[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/${buildGetShortLinksItemRoute(ID_FORMAT)}`),
    },
    ({ reply }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      return reply(
        shortLinks
          .filter(({ itemId: id }) => id === itemId)
          .reduce<ShortLinksOfItem>((acc, s) => {
            if (acc[s.platform]) {
              throw new Error(
                `Duplication of platform ${s} in shortlinks for item ${itemId}!`,
              );
            }

            return { ...acc, [s.platform]: s.alias };
          }, {}),
      );
    },
  ).as('getShortLinksItem');
};

export const mockCheckShortLink = (shouldAliasBeAvailable: boolean): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/${buildGetShortLinkAvailableRoute(SHORTLINK_FORMAT)}`,
      ),
    },
    ({ reply }) => {
      if (shouldAliasBeAvailable) {
        return reply({ available: true });
      }

      return reply({ available: false });
    },
  ).as('checkShortLink');
};

export const mockPostShortLink = (
  shortLinks: ShortLink[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/${buildPostShortLinkRoute()}`),
    },
    ({ reply, body }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      shortLinks.push(body);

      return reply(body);
    },
  ).as('postShortLink');
};

export const mockPatchShortLink = (
  shortLinks: ShortLink[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Patch,
      url: new RegExp(
        `${API_HOST}/${buildPatchShortLinkRoute(SHORTLINK_FORMAT)}`,
      ),
    },
    ({ reply, body, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const urlParams = url.split('/');
      const patchedAlias = urlParams[urlParams.length - 1];

      const shortLink = shortLinks.find(
        (shortlink) => shortlink.alias === patchedAlias,
      );

      // This works only because of JS referenced object. It is for a mocked db only.
      shortLink.alias = body.alias;

      return reply(shortLink);
    },
  ).as('patchShortLink');
};

export const mockDeleteShortLink = (
  shortLinks: ShortLink[],
  shouldThrowError: boolean,
): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(
        `${API_HOST}/${buildDeleteShortLinkRoute(SHORTLINK_FORMAT)}`,
      ),
    },
    ({ reply, url }) => {
      if (shouldThrowError) {
        return reply({ statusCode: StatusCodes.BAD_REQUEST });
      }

      const urlParams = url.split('/');
      const deletedAlias = urlParams[urlParams.length - 1];

      const idxToRemove = shortLinks.findIndex(
        (shortLink) => shortLink.alias === deletedAlias,
      );
      const removed = shortLinks[idxToRemove];
      // This works only because of JS referenced object. It is for a mocked db only.
      shortLinks.splice(idxToRemove, 1);

      return reply(removed);
    },
  ).as('deleteShortLink');
};

export const mockGetLinkMetadata = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/embedded-links/metadata*`),
    },
    ({ reply, url }) => {
      let linkUrl = new URL(url).searchParams.get('link');

      if (!linkUrl.includes('http')) {
        linkUrl = `https://${linkUrl}`;
      }
      if (URL.canParse(linkUrl)) {
        return reply({
          title: 'Page title',
          description: 'Page description',
          html: '',
          icons: [],
          thumbnails: [],
        });
      }
      return reply({ statusCode: StatusCodes.BAD_REQUEST });
    },
  ).as('getLinkMetadata');
};

export const mockGetOwnMembershipRequests = (
  currentMember: Member,
  membershipRequests: CompleteMembershipRequest[],
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(
        `${API_HOST}/items/${ID_FORMAT}/memberships/requests/own$`,
      ),
    },
    ({ reply, url }) => {
      const urlParams = url.split('/');
      const itemId = urlParams[urlParams.length - 4];
      return reply(
        membershipRequests.find(
          ({ item, member }) =>
            item.id === itemId && member.id === currentMember.id,
        ),
      );
    },
  ).as('getOwnMembershipRequests');
};

export const mockRequestMembership = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/memberships/requests$`),
    },
    ({ reply }) => reply({ statusCode: StatusCodes.OK }),
  ).as('requestMembership');
};

export const mockGetMembershipRequestsForItem = (
  membershipRequests: CompleteMembershipRequest[],
): void => {
  cy.intercept(
    {
      method: HttpMethod.Get,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/memberships/requests$`),
    },
    ({ reply, url }) => {
      const urlParams = url.split('/');
      const itemId = urlParams[urlParams.length - 3];
      return reply(membershipRequests.filter(({ item }) => item.id === itemId));
    },
  ).as('getMembershipRequestsForItem');
};

export const mockRejectMembershipRequest = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Delete,
      url: new RegExp(
        `${API_HOST}/items/${ID_FORMAT}/memberships/requests/${ID_FORMAT}`,
      ),
    },
    ({ reply }) => {
      reply({ statusCode: StatusCodes.OK });
    },
  ).as('rejectMembershipRequest');
};

export const mockEnroll = (): void => {
  cy.intercept(
    {
      method: HttpMethod.Post,
      url: new RegExp(`${API_HOST}/items/${ID_FORMAT}/enroll`),
    },
    ({ reply }) => {
      reply({ statusCode: StatusCodes.OK });
    },
  ).as('enroll');
};
