import { PERMISSION_LEVELS } from '../../src/enums';
import { DEFAULT_FOLDER_ITEM } from './items';
import { MEMBERS } from './members';

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
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.FANNY.id,
        },
      ],
      invitations: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130004',
          itemPath: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          email: MEMBERS.ANNA.email,
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130005',
          itemPath: 'bcafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.WRITE,
          email: MEMBERS.BOB.email,
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130006',
          itemPath:
            'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.WRITE,
          email: MEMBERS.CEDRIC.email,
        },
        {
          id: 'ecbfbd2a-5688-11eb-be93-0242ac130007',
          itemPath:
            'bcafbd2a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.READ,
          email: MEMBERS.DAVID.email,
        },
      ],
    },
  ],
};
