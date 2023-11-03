import {
  DiscriminatedItem,
  ItemMembership,
  Member,
  PermissionLevel,
} from '@graasp/sdk';

import { v4 } from 'uuid';

import { ApiConfig } from '../support/types';
import { DEFAULT_FOLDER_ITEM } from './items';
import { MEMBERS } from './members';

export const buildItemMembership = (args: {
  permission?: PermissionLevel;
  item: DiscriminatedItem;
  member: Member;
  creator?: Member;
}): ItemMembership => ({
  permission: args.permission ?? PermissionLevel.Admin,
  member: args.member,
  item: args.item,
  creator: args.creator ?? args.member,
  createdAt: '2021-08-11T12:56:36.834Z',
  updatedAt: '2021-08-11T12:56:36.834Z',
  id: v4(),
});

const sampleItems: DiscriminatedItem[] = [
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fcafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fcafbd2a_5688_11eb_ae93_0242ac130002',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name2',
    path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
  },
];

// eslint-disable-next-line import/prefer-default-export
export const ITEMS_WITH_MEMBERSHIPS: ApiConfig = {
  items: [
    {
      ...sampleItems[0],
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          item: sampleItems[0],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          item: sampleItems[0],
          permission: PermissionLevel.Write,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130002',
          item: sampleItems[0],
          permission: PermissionLevel.Write,
          member: MEMBERS.CEDRIC,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
          creator: MEMBERS.ANNA,
        },
        {
          id: 'ecbfbd2a-5688-11eb-be93-0242ac130002',
          item: sampleItems[0],
          permission: PermissionLevel.Read,
          member: MEMBERS.DAVID,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...sampleItems[1],
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          item: sampleItems[1],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          item: sampleItems[0],
          permission: PermissionLevel.Write,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    sampleItems[2],
  ],
};

const sampleItemsWithWriteAccess: DiscriminatedItem[] = [
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    creator: MEMBERS.BOB,
    name: 'own_item_name1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  },
];

export const ITEM_WITH_WRITE_ACCESS: ApiConfig = {
  items: [
    {
      ...sampleItemsWithWriteAccess[0],
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          item: sampleItemsWithWriteAccess[0],
          permission: PermissionLevel.Admin,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          item: sampleItemsWithWriteAccess[0],
          permission: PermissionLevel.Write,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130002',
          item: sampleItemsWithWriteAccess[0],
          permission: PermissionLevel.Read,
          member: MEMBERS.CEDRIC,
          creator: MEMBERS.ANNA,
          updatedAt: '2021-08-11T12:56:36.834Z',
          createdAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
  ],
};
