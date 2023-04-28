import { Item, PermissionLevel } from '@graasp/sdk';

import { DEFAULT_FOLDER_ITEM } from './items';
import { MEMBERS } from './members';
import { ApiConfig } from '../support/types';

const items: Item[] = [{
  ...DEFAULT_FOLDER_ITEM,
  creator: MEMBERS.BOB,
  id: 'ecdfbd2a-5688-11eb-ae93-0242ac130002',
  name: 'shared_item_name1',
  path: 'ecdfbd2a_5688_11eb_ae93_0242ac130002',
}, {
  ...DEFAULT_FOLDER_ITEM,
  creator: MEMBERS.CEDRIC,
  id: 'fdf19f5a-5688-11eb-ae93-0242ac130002',
  name: 'shared_item_name2',
  path: 'fdf19f5a_5688_11eb_ae93_0242ac130002',
}]

// eslint-disable-next-line import/prefer-default-export
export const SHARED_ITEMS: ApiConfig = {
  items: [
    {
      ...items[0],
      memberships: [
        {
          item: items[0],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          createdAt: new Date('2021-04-13 14:56:34.749946'),
          updatedAt: new Date('2021-04-13 14:56:34.749946'),
          id: 'e51797ec-c639-44c2-8681-2bb024a96db5'
        },
      ],
    },
    {
      ...items[1],
      memberships: [
        {
          item: items[1],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          createdAt: new Date('2021-04-13 14:56:34.749946'),
          updatedAt: new Date('2021-04-13 14:56:34.749946'),
          id: 'e51797ec-c639-14c2-8681-2bb024a96db5'
        },
        {
          item: items[1],
          permission: PermissionLevel.Read,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          createdAt: new Date('2021-04-13 14:56:34.749946'),
          updatedAt: new Date('2021-04-13 14:56:34.749946'),
          id: 'e51797ec-c639-44c2-4681-2bb024a96db5'
        },
      ],
    },
  ],
};
