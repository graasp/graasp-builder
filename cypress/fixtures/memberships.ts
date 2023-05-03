import { Item, ItemMembership, Member, PermissionLevel } from '@graasp/sdk';
import { v4 } from 'uuid';

import { DEFAULT_FOLDER_ITEM, } from './items';
import { MEMBERS } from './members';
import { ApiConfig } from '../support/types';

export const buildItemMembership = (args: { permission?: PermissionLevel, item: Item, member: Member, creator?: Member }): ItemMembership => ({
  permission: args.permission ?? PermissionLevel.Admin,
  member: args.member,
  item: args.item,
  creator: args.creator ?? args.member,
  createdAt: new Date(),
  updatedAt: new Date(),
  id: v4()

})

const sampleItems: Item[] = [{
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
}]



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
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          item: sampleItems[0],
          permission: PermissionLevel.Write,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130002',
          item: sampleItems[0],
          permission: PermissionLevel.Write,
          member: MEMBERS.CEDRIC,
          updatedAt: new Date(),
          createdAt: new Date(),
          creator: MEMBERS.ANNA,
        },
        {
          id: 'ecbfbd2a-5688-11eb-be93-0242ac130002',
          item: sampleItems[0],
          permission: PermissionLevel.Read,
          member: MEMBERS.DAVID,
          creator: MEMBERS.ANNA,
          updatedAt: new Date(),
          createdAt: new Date(),
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
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          item: sampleItems[0],
          permission: PermissionLevel.Write,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ],
    },
    sampleItems[2]
  ],
};

const sampleItemsWithWriteAccess: Item[] = [{
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  creator: MEMBERS.BOB,
  name: 'own_item_name1',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
}]

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
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          item: sampleItemsWithWriteAccess[0],
          permission: PermissionLevel.Write,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130002',
          item: sampleItemsWithWriteAccess[0],
          permission: PermissionLevel.Read,
          member: MEMBERS.CEDRIC,
          creator: MEMBERS.ANNA,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ],
    },
  ],
};
