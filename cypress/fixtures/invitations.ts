import { v4 } from 'uuid';

import { Invitation, Item, PermissionLevel } from '@graasp/sdk';

import { DEFAULT_FOLDER_ITEM } from './items';
import { MEMBERS } from './members';

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

// eslint-disable-next-line import/prefer-default-export
export const ITEMS_WITH_INVITATIONS = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'bcafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'parent',
      path: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {},
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'own_item_name1',
      path: 'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      // for tests only
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          itemPath: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PermissionLevel.Admin,
          memberId: MEMBERS.FANNY.id,
        },
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130004',
          itemPath: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PermissionLevel.Admin,
          email: MEMBERS.ANNA.email,
        },
      ],
      invitations: [
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130005',
          itemPath: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PermissionLevel.Write,
          email: MEMBERS.BOB.email,
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130006',
          itemPath:
            'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PermissionLevel.Write,
          email: MEMBERS.CEDRIC.email,
        },
        {
          id: 'ecbfbd2a-5688-11eb-be93-0242ac130007',
          itemPath:
            'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PermissionLevel.Read,
          email: MEMBERS.DAVID.email,
        },
      ],
    },
  ],
  members: [MEMBERS.FANNY, MEMBERS.ANNA, MEMBERS.EVAN],
};

export const ITEM_WITH_INVITATIONS_WRITE_ACCESS = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'own_item_name1',
      creator: MEMBERS.BOB.id,
      path: 'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      // for tests only
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          itemPath: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PermissionLevel.Write,
          memberId: MEMBERS.ANNA.id,
        },
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130004',
          itemPath: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PermissionLevel.Admin,
          email: MEMBERS.BOB.email,
        },
      ],
      invitations: [
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130005',
          itemPath: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PermissionLevel.Write,
          email: MEMBERS.CEDRIC.email,
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130006',
          itemPath:
            'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PermissionLevel.Read,
          email: MEMBERS.DAVID.email,
        },
      ],
    },
  ],
  members: [MEMBERS.ANNA, MEMBERS.BOB],
};
