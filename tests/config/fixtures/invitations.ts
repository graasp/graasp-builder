import { v4 } from 'uuid';

import { Invitation, Item, PermissionLevel } from '@graasp/sdk';

import { DEFAULT_FOLDER_ITEM } from './items';
import { MEMBERS } from './members';
import { ApiConfig } from '../support/types';

export const buildInvitation = (args: { item: Item, email?: string, permission?: PermissionLevel }): Invitation => {
  const { item, email, permission } = args;
  return ({
    // set temporary id for react-key
    id: v4(),
    email: email ?? '',
    permission: permission ?? PermissionLevel.Read,
    createdAt: new Date(),
    updatedAt: new Date(),
    creator: MEMBERS.ANNA,
    item
  });
}

const itemsWithInvitations: Item[] = [{
  ...DEFAULT_FOLDER_ITEM,
  id: 'bcafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'parent',
  path: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
}, {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'own_item_name1',
  creator: MEMBERS.BOB,
  path: 'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
},]

// eslint-disable-next-line import/prefer-default-export
export const ITEMS_WITH_INVITATIONS: ApiConfig = {
  items: [
    itemsWithInvitations[0],
    {
      ...itemsWithInvitations[1],
      // for tests only
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          item: itemsWithInvitations[0],
          permission: PermissionLevel.Admin,
          member: MEMBERS.FANNY,
          createdAt: new Date(),
          updatedAt: new Date(),
          creator: MEMBERS.ANNA

        },
        // {
        //   id: 'ecafbd2a-5688-11eb-be93-0242ac130004',
        //   item: itemsWithInvitations[0],
        //   permission: PermissionLevel.Admin,
        //   email: MEMBERS.ANNA.email,
        // },
      ],
      invitations: [
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130005',
          item: itemsWithInvitations[0],
          permission: PermissionLevel.Write,
          email: MEMBERS.BOB.email,
          createdAt: new Date(),
          updatedAt: new Date(),
          creator: MEMBERS.ANNA
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130006',
          item: itemsWithInvitations[1],
          permission: PermissionLevel.Write,
          email: MEMBERS.CEDRIC.email,
          createdAt: new Date(),
          updatedAt: new Date(),
          creator: MEMBERS.ANNA
        },
        {
          id: 'ecbfbd2a-5688-11eb-be93-0242ac130007',
          item: itemsWithInvitations[1],
          permission: PermissionLevel.Read,
          email: MEMBERS.DAVID.email,
          createdAt: new Date(),
          updatedAt: new Date(),
          creator: MEMBERS.ANNA
        },
      ],
    },
  ],
  members: [MEMBERS.FANNY, MEMBERS.ANNA, MEMBERS.EVAN],
};

export const ITEM_WITH_INVITATIONS_WRITE_ACCESS: ApiConfig = {
  items: [
    {
      ...itemsWithInvitations[1],

      // for tests only
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          item: itemsWithInvitations[0],
          permission: PermissionLevel.Write,
          member: MEMBERS.ANNA,
          createdAt: new Date(),
          updatedAt: new Date(),
          creator: MEMBERS.ANNA
        },
        // {
        //   id: 'ecafbd2a-5688-11eb-be93-0242ac130004',
        //   item: itemsWithInvitations[0],
        //   permission: PermissionLevel.Admin,
        //   email: MEMBERS.BOB.email,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        //   creator: MEMBERS.ANNA
        // },
      ],
      invitations: [
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130005',
          item: itemsWithInvitations[0],
          permission: PermissionLevel.Write,
          email: MEMBERS.CEDRIC.email,
          createdAt: new Date(),
          updatedAt: new Date(),
          creator: MEMBERS.ANNA
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130006',
          item: itemsWithInvitations[1],
          permission: PermissionLevel.Read,
          email: MEMBERS.DAVID.email,
          createdAt: new Date(),
          updatedAt: new Date(),
          creator: MEMBERS.ANNA
        },
      ],
    },
  ],
  members: [MEMBERS.ANNA, MEMBERS.BOB],
};
