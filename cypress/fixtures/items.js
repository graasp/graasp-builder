import { SETTINGS } from '../../src/config/constants';
import { ITEM_TYPES, PERMISSION_LEVELS } from '../../src/enums';
import { buildItemLoginSchemaExtra } from '../../src/utils/itemExtra';
import { CURRENT_USER, MEMBERS } from './members';
import { DEFAULT_TAGS, ITEM_LOGIN_TAG } from './itemTags';

export const DEFAULT_FOLDER_ITEM = {
  extra: {},
  creator: CURRENT_USER.id,
  type: ITEM_TYPES.FOLDER,
};

export const CREATED_ITEM = {
  name: 'created item',
  type: ITEM_TYPES.FOLDER,
  extra: {
    image: 'someimageurl',
  },
};

export const EDITED_FIELDS = {
  name: 'new name',
};

export const SAMPLE_ITEMS = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'own_item_name1',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
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
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'own_item_name3',
      path:
        'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
      extra: {
        image: 'someimageurl',
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'own_item_name4',
      path:
        'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
      extra: {
        image: 'someimageurl',
      },
    },
  ],
  memberships: [],
};

export const ITEM_LOGIN_ITEMS = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'item login with username',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
        ...buildItemLoginSchemaExtra(SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME),
      },
      tags: [
        {
          tagId: ITEM_LOGIN_TAG.id,
          itemPath: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
        },
      ],
      memberships: [
        {
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
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
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
      name: 'no item login',
      path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
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
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'child of item login with username',
      path:
        'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          itemId: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'item login with username and password',
      path:
        'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
      extra: {
        image: 'someimageurl',
        ...buildItemLoginSchemaExtra(
          SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD,
        ),
      },
      tags: [
        {
          tagId: ITEM_LOGIN_TAG.id,
          itemPath:
            'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
        },
      ],
      memberships: [
        {
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
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
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'egafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'item login with username and password',
      path: 'egafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
        ...buildItemLoginSchemaExtra(
          SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD,
        ),
      },
      tags: [
        {
          tagId: ITEM_LOGIN_TAG.id,
          itemPath: 'egafbd2a_5688_11eb_ae93_0242ac130002',
        },
      ],
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
      id: 'bdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'child of item login with username and password',
      path:
        'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004.bdf09f5a_5688_11eb_ae93_0242ac130004',
      tags: [
        {
          tagId: ITEM_LOGIN_TAG.id,
          itemPath:
            'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
        },
      ],
      memberships: [
        {
          itemId: 'bdf09f5a-5688-11eb-ae93-0242ac130004',
          itemPath: 'bdf09f5a_5688_11eb_ae93_0242ac130004',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
    },
  ],
  tags: DEFAULT_TAGS,
};

export const SHORTCUT = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'gcafbd2a-5688-11eb-ae92-0242ac130002',
  name: 'shortcut for own_item_name1',
  path: 'gcafbd2a_5688_11eb_ae92_0242ac130002',
  type: ITEM_TYPES.SHORTCUT,
  extra: {
    image: 'someimageurl',
  },
};
