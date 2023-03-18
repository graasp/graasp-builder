import { SETTINGS } from '../../src/config/constants';
import { buildItemLoginSchemaExtra } from '../../src/utils/itemExtra';
import { ITEM_TYPES, PERMISSION_LEVELS } from './enums';
import {
  DEFAULT_TAGS,
  ITEM_LOGIN_TAG,
  ITEM_PUBLIC_TAG,
  ITEM_PUBLISHED_TAG,
} from './itemTags';
import { CURRENT_USER, MEMBERS } from './members';

const HIDDEN_ITEM_TAG_ID = Cypress.env('HIDDEN_ITEM_TAG_ID');

export const DEFAULT_FOLDER_ITEM = {
  extra: {},
  creator: CURRENT_USER.id,
  type: ITEM_TYPES.FOLDER,
  createdAt: new Date('2020-01-01T01:01:01Z'),
  updatedAt: new Date('2020-01-02T01:01:01Z'),
  settings: {
    ccLicenseAdaption: 'CC BY',
  }
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
      createdAt: '2023-01-16T16:00:50.968Z',
      updatedAt: '2023-01-18T16:00:52.655Z',
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
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
      name: 'own_item_name2',
      path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      createdAt: '2021-05-16T16:00:50.968Z',
      updatedAt: '2021-06-16T16:00:52.655Z',
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
      settings: {
        ccLicenseAdaption: 'CC BY-NC',
      }
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'own_item_name3',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
      extra: {
        image: 'someimageurl',
        ccLicenseAdaption: 'CC BY-NC',
      },
      createdAt: '2022-12-16T16:00:50.968Z',
      updatedAt: '2022-12-18T16:00:52.655Z',
      memberships: [
        {
          itemPath: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'own_item_name4',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          itemPath: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
      settings: {
        ccLicenseAdaption: 'CC0',
      }
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130005',
      name: 'own_item_name5',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130005',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          itemPath: 'fdf09f5a-5688-11eb-ae93-0242ac130005',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
      settings: {
        ccLicenseAdaption: 'CC BY-NC-SA',
      }
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130006',
      name: 'own_item_name6',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130006',
      extra: {
        image: 'someimageurl',
      },
      createdAt: '2022-12-16T16:00:50.968Z',
      updatedAt: '2022-12-18T16:00:52.655Z',
      memberships: [
        {
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130006',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
      settings: {
        ccLicenseAdaption: 'CC BY-NC-ND',
      }
    },
  ],
  memberships: [],
};

export const generateOwnItems = (number) => {
  const id = (i) => `cafebabe-dead-beef-1234-${`${i}`.padStart(12, '0')}`;
  const path = (i) => id(i).replaceAll('-', '_');

  return Array(number)
    .fill(null)
    .map((_, i) => ({
      ...DEFAULT_FOLDER_ITEM,
      id: id(i),
      name: `item ${i}`,
      path: path(i),
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          itemPath: path(i),
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
    }));
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
          id: 'efaf3d5a-5688-11eb-ae93-0242ac130002',
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
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
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
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
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
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004.bdf09f5a_5688_11eb_ae93_0242ac130004',
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

export const SAMPLE_PUBLIC_ITEMS = {
  items: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
      name: 'parent public item',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      tags: [
        {
          id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
          tagId: ITEM_PUBLIC_TAG.id,
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
      name: 'private item',
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
      name: 'child of public item',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
      extra: {
        image: 'someimageurl',
      },
      memberships: [
        {
          itemId: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130003',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'public item',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
      extra: {
        image: 'someimageurl',
      },
      tags: [
        {
          tagId: ITEM_PUBLIC_TAG.id,
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
      name: 'public item',
      path: 'egafbd2a_5688_11eb_ae93_0242ac130002',
      extra: {
        image: 'someimageurl',
      },
      tags: [
        {
          tagId: ITEM_PUBLIC_TAG.id,
          itemPath: 'egafbd2a_5688_11eb_ae93_0242ac130002',
        },
      ],
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'bdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'child of public item',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004.bdf09f5a_5688_11eb_ae93_0242ac130004',
      tags: [
        {
          tagId: ITEM_PUBLIC_TAG.id,
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
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac133002',
      name: 'child of private item',
      path: 'fdf09f5a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac133002',
      extra: {
        image: 'someimageurl',
      },
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

export const ITEM_REORDER_ITEMS = {
  parent: {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'parent',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
    extra: {
      image: 'someimageurl',
    },
  },
  children: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'child1',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
      extra: {
        image: 'someimageurl',
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'child2',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
      extra: {
        image: 'someimageurl',
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130005',
      name: 'child3',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130005',
      extra: {
        image: 'someimageurl',
      },
    },
  ],
};

export const ORDERED_ITEMS = {
  parent: {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'parent',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
    extra: {
      image: 'someimageurl',
      folder: {
        childrenOrder: [
          'adf09f5a-5688-11eb-ae93-0242ac130005',
          'adf09f5a-5688-11eb-ae93-0242ac130003',
          // item id below does not belong to any item
          'adf09f5a-5688-11eb-ae93-0242ac130006',
          'adf09f5a-5688-11eb-ae93-0242ac130004',
        ],
      },
    },
  },
  children: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'adf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'child1',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.adf09f5a_5688_11eb_ae93_0242ac130003',
      extra: {
        image: 'someimageurl',
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'adf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'child2',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.adf09f5a_5688_11eb_ae93_0242ac130004',
      extra: {
        image: 'someimageurl',
      },
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'adf09f5a-5688-11eb-ae93-0242ac130005',
      name: 'child3',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.adf09f5a_5688_11eb_ae93_0242ac130005',
      extra: {
        image: 'someimageurl',
      },
    },
  ],
  // The order below is the order in which the existing children should appear
  existingChildrenOrder: [
    'adf09f5a-5688-11eb-ae93-0242ac130005',
    'adf09f5a-5688-11eb-ae93-0242ac130003',
    'adf09f5a-5688-11eb-ae93-0242ac130004',
  ],
};

export const PUBLISHED_ITEM = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'parent public item',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  extra: {
    image: 'someimageurl',
  },
  tags: [
    {
      id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
      tagId: ITEM_PUBLIC_TAG.id,
      itemPath: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
    },
    {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
      tagId: ITEM_PUBLISHED_TAG.id,
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
};

export const HIDDEN_ITEM = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130001',
  name: 'parent public item',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130001',
  extra: {
    image: 'someimageurl',
  },
  tags: [
    {
      id: 'ecbfbd2a-5688-11eb-ae93-0242ac130001',
      tagId: ITEM_PUBLIC_TAG.id,
      itemPath: 'ecafbd2a_5688_11eb_ae93_0242ac130001',
    },
    {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130001',
      tagId: HIDDEN_ITEM_TAG_ID,
      itemPath: 'ecafbd2a_5688_11eb_ae93_0242ac130001',
    },
  ],
  memberships: [
    {
      itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130001',
      permission: PERMISSION_LEVELS.ADMIN,
      memberId: MEMBERS.ANNA.id,
    },
    {
      itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130001',
      permission: PERMISSION_LEVELS.READ,
      memberId: MEMBERS.BOB.id,
    },
  ],
};

export const CHILD_HIDDEN_ITEM = {
  ...HIDDEN_ITEM,
  id: 'ecafbd2a-3688-11eb-ae93-0242ac130003',
  name: 'child of hidden item',
  path: `${HIDDEN_ITEM.path}.ecafbd2a_3688_11eb_ae93_0242ac130003`,
};

export const PINNED_ITEM = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'parent public item',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  extra: {
    image: 'someimageurl',
  },
  settings: {
    isPinned: true,
    showChatbox: true,
  },
  memberships: [
    {
      itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
      permission: PERMISSION_LEVELS.ADMIN,
      memberId: MEMBERS.ANNA.id,
    },
  ],
};

export const ITEMS_SETTINGS = {
  items: [
    HIDDEN_ITEM,
    PINNED_ITEM,
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130003',
      name: 'parent public item',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130003',
      extra: {
        image: 'someimageurl',
      },
      settings: {
        isPinned: false,
        showChatbox: false,
        enableSaveActions: false,
      },
      memberships: [
        {
          itemPath: 'fdf09f5a_5688_11eb_ae93_0242ac130003',
          permission: PERMISSION_LEVELS.ADMIN,
          memberId: MEMBERS.ANNA.id,
        },
      ],
    },
    CHILD_HIDDEN_ITEM,
  ],
};
