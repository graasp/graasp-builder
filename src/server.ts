import qs from 'qs';
import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  createServer,
  Model,
  Factory,
  RestSerializer,
  Response,
  belongsTo,
} from 'miragejs';
import { Invitation, Item, ItemLoginSchema, ItemLoginSchemaType, ItemMembership, Member, MemberType, PermissionLevel, setCurrentSession } from '@graasp/sdk';
import groupBy from 'lodash.groupby';

import { API_ROUTES } from '@graasp/query-client'
import { HOST } from './config/constants';

const { buildPostItemRoute, buildGetInvitationRoute, buildGetChildrenRoute, buildGetItemLoginSchemaTypeRoute, buildGetMembersRoute, buildGetItemMembershipsForItemsRoute, buildGetMember, GET_CURRENT_MEMBER_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, SIGN_IN_WITH_PASSWORD_ROUTE, GET_OWN_ITEMS_ROUTE, SHARED_ITEM_WITH_ROUTE, buildGetItemRoute } = API_ROUTES

export type Database = {
  currentMember?: Member;
  items?: Item[];
  invitations?: Invitation[];
  itemMemberships?: ItemMembership[],
  members?: Member[];
};


const ApplicationSerializer = RestSerializer.extend({
  root: false,
  embed: true,
});

const DEFAULT_MEMBER = {
  id: 'mock-current-user',
  email: 'mock-email',
  name: 'mock-name',
  extra: {},
  type: MemberType.Individual,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const UnauthenticatedError = new Response(
  StatusCodes.UNAUTHORIZED,
  { some: 'header' },
  { errors: ['User is not authenticated !!!'] },
);

const NotFoundError = new Response(
  StatusCodes.NOT_FOUND,
  { some: 'header' },
  { errors: ['element not found'] },
);

export const buildDatabase = ({
  currentMember = DEFAULT_MEMBER,
  items = [],
  invitations = [],
  members,
}: Partial<Database> = {}): Database => ({
  currentMember,
  items,
  invitations,
  members: members ?? [currentMember],
});

export const mockServer = ({
  urlPrefix,
  database = buildDatabase(),
  externalUrls = [],
}: any = {}): any => {
  const { members, invitations, itemMemberships, items, currentMember, itemLoginSchema } = database;
  const checkIsAuthenticated = () => Boolean(currentMember?.id);
  // mocked errors
  // const {
  // } = errors;
  if (currentMember) {
    console.log('wefuj')
    setCurrentSession(currentMember, 'localhost')
  }

  console.log(`/${buildGetItemMembershipsForItemsRoute([':id'])}`)

  return createServer({
    // environment
    urlPrefix,
    models: {
      invitation: Model,
      item: Model.extend({
        // creator: belongsTo("member"),
      }),
      itemMembership: Model.extend({
        // item: belongsTo("item"),
        // creator: belongsTo("member"),
        // member: belongsTo("member"),
      }),
      itemLoginSchema: Model,
      member: Model,
    },
    factories: {
      item: Factory.extend<Item>({
        id: () => v4(),
        extra: () => ({} as any),
        description: () => '',
        path: () => 'path',
        type: () => 'folder',
        name: (idx: number) => `member-${idx}`,
        createdAt: new Date(),
        updatedAt: new Date(), settings: {}, creator: currentMember
      }),
      member: Factory.extend<Member>({
        id: () => v4(),
        extra: () => ({}),
        email: (idx: number) => `member-email-${idx}`,
        name: (idx: number) => `member-${idx}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: MemberType.Individual
      }),
      itemMembership: Factory.extend<ItemMembership>({
        id: () => v4(),
        item: items?.[0],
        member: () => currentMember,
        createdAt: new Date(),
        updatedAt: new Date(),
        permission: () => PermissionLevel.Read,
        creator: () => currentMember,
      }),
      invitation: Factory.extend<Invitation>({
        id: () => v4(),
        permission: () => PermissionLevel.Read,
        email: (idx: number) => `invitation-email-${idx}`,
        createdAt: new Date(),
        creator: currentMember,
        item: items?.[0],
        updatedAt: new Date(),
      }),
      itemLoginSchema: Factory.extend<ItemLoginSchema>({
        id: () => v4(),
        type: () => ItemLoginSchemaType.USERNAME,
        createdAt: new Date(),
        item: items?.[0],
        updatedAt: new Date(),
      }),
    },

    serializers: {
      item: ApplicationSerializer,
      invitation: ApplicationSerializer,
      member: ApplicationSerializer,
      itemMembership: ApplicationSerializer,
      itemLoginSchema: ApplicationSerializer,
    },
    seeds(server) {
      members?.forEach((m) => {
        server.create('member', m);
      });
      items?.forEach((i) => {
        // const creator = server.schema.findBy('member', { id: i.creator.id })
        // server.create('item', { ...i, creator });
        server.create('item', i);
      });
      itemMemberships?.forEach((im) => {
        // const creator = server.schema.findBy('member', { id: im.creator.id })
        // const member = server.schema.findBy('member', { id: im.member.id })
        // const item = server.schema.findBy('item', { id: im.item.id })
        // server.create('itemMembership', { ...im, creator, member, item });
        server.create('itemMembership', im);
      });
      itemLoginSchema?.forEach((im) => {
        server.create('itemLoginSchema', im);
      });
      invitations?.forEach((inv) => {
        server.create('invitation', inv);
      });
    },
    routes() {
      // invitation
      this.get(`/${buildGetInvitationRoute(':id')}`, (schema, request) => {
        const {
          params: { id },
        } = request;

        const invitation = schema.find('invitation', id);
        if (!invitation) {
          return NotFoundError;
        }

        return invitation;
      });

      // auth
      this.post(`/${SIGN_IN_ROUTE}`, () => {
        if (currentMember) {
          return new Response(StatusCodes.BAD_REQUEST);
        }

        return new Response(StatusCodes.NO_CONTENT);
      });
      this.post(`/${SIGN_IN_WITH_PASSWORD_ROUTE}`, (schema, request) => {
        if (currentMember) {
          return new Response(StatusCodes.BAD_REQUEST);
        }

        const { email, password } = JSON.parse(request.requestBody);

        const member = schema.findBy('member', { email });
        if (member?.extra?.password === password) {
          return new Response(StatusCodes.NO_CONTENT);
        }

        return new Response(StatusCodes.BAD_REQUEST);
      });

      this.post(`/${SIGN_UP_ROUTE}`, () => {
        if (currentMember) {
          return new Response(StatusCodes.BAD_REQUEST);
        }

        return new Response(StatusCodes.NO_CONTENT);
      });

      // ------- MEMBERS
      this.get(`/${GET_CURRENT_MEMBER_ROUTE}`, () => {
        if (!currentMember && !checkIsAuthenticated()) {
          return UnauthenticatedError;
        }

        return currentMember!;
      });

      this.get(`/${buildGetMember(':id')}`, (schema, request) => {
        if (!checkIsAuthenticated()) {
          return UnauthenticatedError;
        }

        const {
          params: { id },
        } = request;
        const member = schema.find('member', id);

        if (!member) {
          return new Response(StatusCodes.NOT_FOUND);
        }
        return member;
      });


      this.get(`/members/:id/avatar/small`, (schema, request) =>
        // TODO
        new Response(StatusCodes.NOT_FOUND)
      )


      this.get(`/members`, (schema, request) => {

        if (!checkIsAuthenticated()) {
          return UnauthenticatedError;
        }

        let { id: memberIds } = qs.parse(request.url.split('?')[1]);
        if (typeof memberIds === 'string') {
          memberIds = [memberIds];
        }
        const ids = memberIds as string[];
        const m: Member[] = schema.db.members.filter(({ id }) => ids.includes(id))
        // add item id to data
        return { data: m.reduce((a, v) => ({ ...a, [v.id]: v }), {}), errors: [] }
      });

      // ------- ITEMS
      this.get(`/${GET_OWN_ITEMS_ROUTE}`, (schema, request) => {
        console.log('own items')
        return schema.all('item').filter(({ creator }) => creator.id === currentMember.id);
      })

      this.get(`/${SHARED_ITEM_WITH_ROUTE}`, (schema, request) => {
        console.log('shared items')
        return []
      })

      this.get(`/${buildGetItemRoute(':id')}`, (schema, request) => {

        const {
          params: { id },
        } = request;
        const item = schema.findBy('item', { id });

        if (!item) {
          return new Response(StatusCodes.NOT_FOUND);
        }

        return item;
      })

      this.get(`/items/:id/children`, (schema, request) => {

        const {
          params: { id },
        } = request;
        const item = schema.findBy('item', { id });

        if (!item) {
          return new Response(StatusCodes.NOT_FOUND);
        }

        // TODO: remove children of children
        return schema.all('item').filter(({ path }) => path.startsWith(item.path));
      })

      this.post(`/${buildPostItemRoute()}`, (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        const newId = v4()
        let path = newId.replaceAll(/-/g, '_')

        let { parentId } = qs.parse(request.url.split('?')[1]);
        if (parentId) {
          parentId = parentId as string
          const item = schema.findBy('item', { id: parentId });
          if (!item) {
            return new Response(StatusCodes.NOT_FOUND);
          }
          path = `${parentId.replaceAll(/-/g, '_')}.${path}`
        }
        console.log(parentId)
        const newItem = schema.items.create({ ...attrs, id: newId, path, creator: currentMember, createdAt: new Date(), updatedAt: new Date() });
        // create corresponding membership
        const d = schema.itemMemberships.create({ item: newItem.attrs, permission: PermissionLevel.Admin, member: currentMember, creator: currentMember, createdAt: new Date(), updatedAt: new Date() });
        console.log('fke', d)

        return newItem
      })

      // ------- ITEM MEMBERSHIP
      this.get(`/${buildGetItemMembershipsForItemsRoute([])}`, (schema, request) => {

        let { itemId: itemIds } = qs.parse(request.url.split('?')[1]);
        if (typeof itemIds === 'string') {
          itemIds = [itemIds];
        }
        const ids = itemIds as string[];

        const m = schema.db.itemMemberships.filter(({ item }) => ids.includes(item.id))
          // add item id to data
          .map(im => ({ ...im, itemId: im.item.id }));
        return { data: groupBy(m, 'itemId'), errors: [] }
      })

      // ---- THUMBNAILS

      this.get(`/items/:id/thumbnails/small`, (schema, request) =>
        // TODO
        new Response(StatusCodes.NOT_FOUND)
      )

      // ------- ITEM-LOGIN
      this.get(`/${buildGetItemLoginSchemaTypeRoute(':id')}`, (schema, request) => {

        const {
          params: { id },
        } = request;
        const loginSchema = schema.all('itemLoginSchema').filter(({ item }) => item.id === id);
        return loginSchema?.[0]?.type
      })

      // passthrough external urls
      externalUrls.forEach((url) => {
        this.passthrough(url);
      });
    },
  });
};

export default mockServer;
