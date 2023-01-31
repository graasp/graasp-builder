import { PERMISSION_LEVELS } from './enum';
import { DEFAULT_FOLDER_ITEM } from './items';
import { MEMBERS } from './members';

// eslint-disable-next-line import/prefer-default-export
export const SHARED_ITEMS = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      creator: MEMBERS.BOB.id,
      id: 'ecdfbd2a-5688-11eb-ae93-0242ac130002',
      name: 'shared_item_name1',
      path: 'ecdfbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      creator: MEMBERS.CEDRIC.id,
      id: 'fdf19f5a-5688-11eb-ae93-0242ac130002',
      name: 'shared_item_name2',
      path: 'fdf19f5a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          itemPath: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
        {
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.READ,
          memberId: MEMBERS.BOB.id,
        },
      ],
    },
  ],
};
