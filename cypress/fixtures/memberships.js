import { PERMISSION_LEVELS } from './enums';
import { DEFAULT_FOLDER_ITEM } from './items';
import { MEMBERS } from './members';

// eslint-disable-next-line import/prefer-default-export
export const ITEMS_WITH_MEMBERSHIPS = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'own_item_name1',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          itemPath: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          itemPath: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.WRITE,
          memberId: MEMBERS.BOB.id,
        },
        {
          id: 'ecafbd1a-5688-11eb-be93-0242ac130002',
          itemPath: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.WRITE,
          memberId: MEMBERS.CEDRIC.id,
        },
        {
          id: 'ecbfbd2a-5688-11eb-be93-0242ac130002',
          itemPath: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.READ,
          memberId: MEMBERS.DAVID.id,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fcafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'own_item_name1',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fcafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          id: 'ecafbd2a-5688-11eb-be93-0242ac130002',
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
        {
          id: 'ecafbd2a-5688-11eb-be92-0242ac130002',
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.WRITE,
          memberId: MEMBERS.BOB.id,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
      name: 'own_item_name2',
      path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
    },
  ],
};
