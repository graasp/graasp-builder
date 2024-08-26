import {
  DiscriminatedItem,
  Invitation,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { v4 } from 'uuid';

import { ApiConfig } from '../support/types';
import { MEMBERS } from './members';

export const buildInvitation = (args: {
  item: DiscriminatedItem;
  email?: string;
  permission?: PermissionLevel;
}): Invitation => {
  const { item, email, permission } = args;
  return {
    // set temporary id for react-key
    id: v4(),
    email: email ?? '',
    permission: permission ?? PermissionLevel.Read,
    createdAt: '2021-08-11T12:56:36.834Z',
    updatedAt: '2021-08-11T12:56:36.834Z',
    creator: MEMBERS.ANNA,
    item,
  };
};

// warning: default permission admin
const itemsWithInvitations: DiscriminatedItem[] = [
  PackedFolderItemFactory({
    id: 'bcafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'parent',
    path: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
  }),
  PackedFolderItemFactory({
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name1',
    creator: MEMBERS.BOB,
    path: 'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
  }),
];

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
          account: MEMBERS.FANNY,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
        {
          id: 'ecafbd2a-5688-11eb-be93-0212ac130002',
          item: itemsWithInvitations[0],
          permission: PermissionLevel.Admin,
          account: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
      ],
      invitations: [
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130005',
          item: itemsWithInvitations[0],
          permission: PermissionLevel.Write,
          email: MEMBERS.BOB.email,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130006',
          item: itemsWithInvitations[1],
          permission: PermissionLevel.Write,
          email: MEMBERS.CEDRIC.email,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
        {
          id: 'ecbfbd2a-5688-11eb-be93-0242ac130007',
          item: itemsWithInvitations[1],
          permission: PermissionLevel.Read,
          email: MEMBERS.DAVID.email,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
      ],
    },
  ],
  members: [MEMBERS.FANNY, MEMBERS.ANNA, MEMBERS.EVAN],
};

// warning: default permission admin
const itemsWithInvitationsWriteAccess: DiscriminatedItem[] = [
  PackedFolderItemFactory(
    {
      id: 'bcafbd2a-5688-11eb-ae93-0242ac130002',
      path: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
    },
    { permission: PermissionLevel.Write },
  ),
  PackedFolderItemFactory(
    {
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      creator: MEMBERS.BOB,
      path: 'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
    },
    { permission: PermissionLevel.Write },
  ),
];
export const ITEM_WITH_INVITATIONS_WRITE_ACCESS: ApiConfig = {
  items: [
    {
      ...itemsWithInvitationsWriteAccess[1],

      // for tests only
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          item: itemsWithInvitationsWriteAccess[0],
          permission: PermissionLevel.Write,
          account: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
      ],
      invitations: [
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130005',
          item: itemsWithInvitationsWriteAccess[0],
          permission: PermissionLevel.Write,
          email: MEMBERS.CEDRIC.email,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130006',
          item: itemsWithInvitationsWriteAccess[1],
          permission: PermissionLevel.Read,
          email: MEMBERS.DAVID.email,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
      ],
    },
  ],
  members: [MEMBERS.ANNA, MEMBERS.BOB],
};
