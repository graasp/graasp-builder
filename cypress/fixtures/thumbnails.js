import { FIXTURES_THUMBNAILS_FOLDER } from '../support/constants';
import { PERMISSION_LEVELS } from './enums';
import { DEFAULT_FOLDER_ITEM } from './items';
import { MEMBERS } from './members';

export const THUMBNAIL_MEDIUM_PATH = 'thumbnails/medium.jpeg';

// eslint-disable-next-line import/prefer-default-export
export const SAMPLE_ITEMS_WITH_THUMBNAILS = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'bfafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'own_item_name1',
      path: 'bfafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          itemPath: 'bfa09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
        {
          itemPath: 'bfa09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.BOB.id,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'bfa09f5a-5688-11eb-ae93-0242ac130002',
      name: 'own_item_name2',
      path: 'bfa09f5a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          itemPath: 'bfa09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.CEDRIC.id,
        },
        {
          itemPath: 'bfa09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.BOB.id,
        },
      ],
      thumbnails: FIXTURES_THUMBNAILS_FOLDER,
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'bfa09f5a-5688-11eb-ae93-0242ac130001',
      name: 'own_item_name3',
      path: 'bfa09f5a_5688_11eb_ae93_0242ac130001',
      extra: {
        image: 'someimageurl',
      },
      creator: MEMBERS.CEDRIC.id,
      memberships: [
        {
          itemPath: 'bfa09f5a_5688_11eb_ae93_0242ac130001',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.CEDRIC.id,
        },
        {
          itemPath: 'bfa09f5a_5688_11eb_ae93_0242ac130001',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.BOB.id,
        },
        {
          itemPath: 'bfa09f5a_5688_11eb_ae93_0242ac130001',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
    },
  ],
  memberships: [],
};
