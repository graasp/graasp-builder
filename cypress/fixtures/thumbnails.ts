import { Item, PermissionLevel } from '@graasp/sdk';

import { FIXTURES_THUMBNAILS_FOLDER } from '../support/constants';
import { DEFAULT_FOLDER_ITEM } from './items';
import { MEMBERS } from './members';
import { ApiConfig } from '../support/types';
import { ITEM_THUMBNAIL_LINK } from './thumbnails/links';

export const THUMBNAIL_MEDIUM_PATH = 'thumbnails/medium.jpeg';

const sampleItems: Item[] = [{
  ...DEFAULT_FOLDER_ITEM,
  id: 'bfafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'own_item_name1',
  path: 'bfafbd2a_5688_11eb_ae93_0242ac130002',

}, {
  ...DEFAULT_FOLDER_ITEM,
  id: 'bfa09f5a-5688-11eb-ae93-0242ac130002',
  name: 'own_item_name2',
  path: 'bfa09f5a_5688_11eb_ae93_0242ac130002',

}, {
  ...DEFAULT_FOLDER_ITEM,
  id: 'bfa09f5a-5688-11eb-ae93-0242ac130001',
  name: 'own_item_name3',
  path: 'bfa09f5a_5688_11eb_ae93_0242ac130001',
  creator: MEMBERS.CEDRIC,
}]

// eslint-disable-next-line import/prefer-default-export
export const SAMPLE_ITEMS_WITH_THUMBNAILS: ApiConfig = {
  items: [
    {
      ...sampleItems[0],
      memberships: [
        {
          item: sampleItems[0],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'eb1a0d13-2a9b-489f-b2da-93a15ce574c0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          item: sampleItems[0],
          permission: PermissionLevel.Admin,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          id: 'eb1a0d13-2a9b-489f-b2fa-93a15ce574c0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
    },
    {
      ...sampleItems[1],
      memberships: [
        {
          item: sampleItems[1],
          permission: PermissionLevel.Admin,
          member: MEMBERS.CEDRIC,
          creator: MEMBERS.ANNA,
          id: 'eb1a0d13-2a9b-489e-b2fa-93a15ce574c0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          item: sampleItems[1],
          permission: PermissionLevel.Admin,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          id: 'eb1a0d13-2a9b-489f-b2fa-23a15ce574c0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      thumbnails: ITEM_THUMBNAIL_LINK,
    },
    {
      ...sampleItems[2],
      memberships: [
        {
          item: sampleItems[2],
          permission: PermissionLevel.Admin,
          member: MEMBERS.CEDRIC,
          creator: MEMBERS.ANNA,
          id: 'eb1a0d13-2a9b-489f-b2fa-93a15ce174c0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          item: sampleItems[2],
          permission: PermissionLevel.Admin,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          id: 'eb1a0d13-2a9b-489f-b2fa-93a17ce574c0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          item: sampleItems[2],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'eb1a0d13-2a9b-489f-b2fa-93a15ce571c0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
    },
  ],
};
