import {
  DiscriminatedItem,
  FolderItemFactory,
  FolderItemType,
  ItemFavorite,
  ItemLoginSchemaType,
  ItemTagType,
  ItemType,
  ItemValidation,
  ItemValidationProcess,
  ItemValidationStatus,
  PermissionLevel,
  RecycledItemData,
  ShortcutItemType,
} from '@graasp/sdk';

import { ApiConfig, ItemForTest } from '../support/types';
import { CURRENT_USER, MEMBERS } from './members';

export const DEFAULT_FOLDER_ITEM: FolderItemType = FolderItemFactory({
  id: 'folder-id',
  name: 'folder',
  path: 'folder-path',
  extra: { [ItemType.FOLDER]: { childrenOrder: [] } },
  creator: CURRENT_USER,
  type: ItemType.FOLDER,
  createdAt: '2020-01-01T01:01:01Z',
  updatedAt: '2020-01-01T01:01:01Z',
  description: 'mydescription',
  settings: {},
});

export const CREATED_ITEM: Partial<FolderItemType> = {
  name: 'created item',
  type: ItemType.FOLDER,
  extra: { [ItemType.FOLDER]: { childrenOrder: [] } },
};

export const CREATED_BLANK_NAME_ITEM: Partial<FolderItemType> = {
  name: ' ',
  type: ItemType.FOLDER,
  extra: { [ItemType.FOLDER]: { childrenOrder: [] } },
};

export const EDITED_FIELDS = {
  name: 'new name',
};
const sampleItems: DiscriminatedItem[] = [
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
    settings: {
      hasThumbnail: false,
    },
    extra: {
      [ItemType.FOLDER]: {
        childrenOrder: ['fdf09f5a-5688-11eb-ae93-0242ac130004'],
      },
    },
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name2',
    path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
    settings: {
      hasThumbnail: false,
    },
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
    name: 'own_item_name3',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
    settings: {
      hasThumbnail: false,
    },
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
    name: 'own_item_name4',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
    settings: {
      hasThumbnail: false,
    },
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130005',
    name: 'own_item_name5',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130005',
    settings: {
      hasThumbnail: false,
    },
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130006',
    name: 'own_item_name6',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130006',
    settings: {
      hasThumbnail: false,
    },
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'eef09f5a-5688-11eb-ae93-0242ac130003',
    name: 'own_item_name7',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003.eef09f5a_5688_11eb_ae93_0242ac130003',
    settings: {
      hasThumbnail: false,
    },
  },
];
export const SAMPLE_ITEMS: ApiConfig = {
  items: [
    {
      ...sampleItems[0],
      memberships: [
        {
          item: sampleItems[0],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          id: 'fdf09f5a-5688-11eb-ae93-0242ac130034',
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...sampleItems[1],
      memberships: [
        {
          item: sampleItems[1],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          id: '2d44caf9-592a-417a-86d3-99432b223c18',
        },
        {
          item: sampleItems[1],
          permission: PermissionLevel.Read,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          id: '2d44caf9-598a-417a-86d3-99432b223c18',
        },
      ],
    },
    {
      ...sampleItems[2],
      memberships: [
        {
          item: sampleItems[2],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          id: '2d44caf9-598a-417b-86d3-99432b223c18',
        },
      ],
    },
    {
      ...sampleItems[3],
      memberships: [
        {
          item: sampleItems[3],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          id: '2d44caf9-598a-317a-86d3-99432b223c18',
        },
      ],
    },
    {
      ...sampleItems[4],
      memberships: [
        {
          item: sampleItems[4],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          id: '2dd4caf9-598a-317a-86d3-99432b223c18',
        },
      ],
    },
    {
      ...sampleItems[5],
      memberships: [
        {
          item: sampleItems[5],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          id: '2dd4caf9-538a-317a-86d3-99432b223c18',
        },
      ],
    },
    {
      ...sampleItems[6],
      memberships: [
        {
          item: sampleItems[6],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
          id: '2dd4caf9-538a-317a-86d3-99432b223c12',
        },
      ],
    },
  ],
  // memberships: [],
};

export const SAMPLE_READ_ITEMS: ApiConfig = {
  items: [
    {
      ...sampleItems[0],
      memberships: [
        {
          item: sampleItems[0],
          permission: PermissionLevel.Read,
          member: MEMBERS.ANNA,
          id: 'fdf09f5a-5688-11eb-ae93-0242ac130034',
          creator: MEMBERS.BOB,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
  ],
};

export const SAMPLE_BOOKMARK: ItemFavorite[] = [
  {
    id: '49883c9b-050b-43d5-bd37-6921e25b55da5',
    createdAt: '2021-08-11T12:56:36.834Z',
    item: sampleItems[1],
  },
  {
    id: '49883c9b-050b-43d5-bd37-6921e25b55da',
    createdAt: '2021-08-11T12:56:36.834Z',
    item: sampleItems[2],
  },
];

export const RECYCLED_ITEM_DATA: RecycledItemData[] = [
  {
    id: 'fdf09f5a-5688-22eb-ae93-0242ac130005',
    creator: CURRENT_USER,
    createdAt: '2021-08-11T12:56:36.834Z',
    item: {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130005',
      name: 'recycled item 1',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130005',
    },
  },
  {
    id: 'fdf12f5a-5688-22eb-ae93-0242ac130005',
    creator: CURRENT_USER,
    createdAt: '2021-08-11T12:56:36.834Z',
    item: {
      ...DEFAULT_FOLDER_ITEM,
      id: 'ecafbd2a-5688-11eb-ae93-0242ac130006',
      name: 'recycled item 2',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130006',
    },
  },
];

export const generateOwnItems = (number: number): ItemForTest[] => {
  const id = (i: number) =>
    `cafebabe-dead-beef-1234-${`${i}`.padStart(12, '0')}`;
  const path = (i: number) => id(i).replace(/-/g, '_');

  return Array(number)
    .fill(null)
    .map((_, i) => {
      const item = {
        ...DEFAULT_FOLDER_ITEM,
        id: id(i),
        name: `item ${i}`,
        path: path(i),
      };

      const mId = `dafebabe-dead-beef-1234-${`${i}`.padStart(12, '0')}`;
      return {
        ...item,
        memberships: [
          {
            item,
            permission: PermissionLevel.Admin,
            member: MEMBERS.ANNA,
            creator: MEMBERS.ANNA,
            createdAt: '2021-08-11T12:56:36.834Z',
            updatedAt: '2021-08-11T12:56:36.834Z',
            id: mId,
          },
        ],
      };
    });
};

const sampleItemsforItemLogin: DiscriminatedItem[] = [
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'item login with username',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
    name: 'no item login',
    path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
    name: 'child of item login with username',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
    name: 'item login with username and password',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ega2bd2a-5688-11eb-ae93-0242ac130002',
    name: 'item login with username and password',
    path: 'egafbd2a_5688_11eb_ae93_0242ac130002',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'bdf09f5a-5688-11eb-ae93-0242ac130004',
    name: 'child of item login with username and password',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004.bdf09f5a_5688_11eb_ae93_0242ac130004',
  },
];

export const ITEM_LOGIN_ITEMS: ApiConfig = {
  items: [
    {
      ...sampleItemsforItemLogin[0],
      itemLoginSchema: {
        item: sampleItemsforItemLogin[0],
        type: ItemLoginSchemaType.Username,
        id: 'efaf3d5a-5688-11eb-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },

      memberships: [
        {
          id: 'edaf3d5a-5688-11eb-ae93-0242ac130002',
          item: sampleItemsforItemLogin[0],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
        {
          item: sampleItemsforItemLogin[0],
          permission: PermissionLevel.Read,
          member: MEMBERS.BOB,
          id: 'edaf3d5a-5688-21eb-ae93-0242ac130002',
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...sampleItemsforItemLogin[1],
      memberships: [
        {
          item: sampleItems[1],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          id: 'edaf3d5a-5688-21db-ae93-0242ac130002',
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...sampleItemsforItemLogin[2],
      memberships: [
        {
          item: sampleItemsforItemLogin[2],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          id: 'edaf3d3a-5688-21eb-ae93-0242ac130002',
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...sampleItemsforItemLogin[3],
      itemLoginSchema: {
        item: sampleItemsforItemLogin[3],
        type: ItemLoginSchemaType.UsernameAndPassword,
        id: 'efaf3d5a-5688-11eb-ae93-0242ac530002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
      memberships: [
        {
          item: sampleItemsforItemLogin[3],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          id: 'edaf2d5a-5688-21eb-ae93-0242ac130002',
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
        {
          item: sampleItemsforItemLogin[3],
          permission: PermissionLevel.Read,
          member: MEMBERS.BOB,
          id: 'edaf3d5a-5682-21eb-ae93-0242ac130002',
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...sampleItemsforItemLogin[4],
      itemLoginSchema: {
        item: sampleItemsforItemLogin[4],
        type: ItemLoginSchemaType.UsernameAndPassword,
        id: 'efaf3d5a-5688-11eb-ae93-0242ac130102',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },

      memberships: [
        {
          item: sampleItemsforItemLogin[4],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          id: 'edaf3d5a-5682-22eb-ae93-0242ac130002',
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...sampleItemsforItemLogin[5],
      memberships: [
        {
          item: sampleItemsforItemLogin[5],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          id: 'edaf3d5a-5682-22eb-ee93-0242ac130002',
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
      itemLoginSchema: {
        item: sampleItemsforItemLogin[3],
        type: ItemLoginSchemaType.UsernameAndPassword,
        id: 'efaf3d5a-5688-11eb-ae93-0242ac730002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
    },
  ],
};

const samplePublicItems: DiscriminatedItem[] = [
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'parent public item',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
    name: 'private item',
    path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
    name: 'child of public item',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
    name: 'public item',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'egafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'public item',
    path: 'egafbd2a_5688_11eb_ae93_0242ac130002',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'bdf09f5a-5688-11eb-ae93-0242ac130014',
    name: 'child of public item',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130014.bdf09f5a_5688_11eb_ae93_0242ac130004',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac133002',
    name: 'child of private item',
    path: 'fdf09f5a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac133002',
  },
];

export const SAMPLE_PUBLIC_ITEMS: ApiConfig = {
  items: [
    {
      ...samplePublicItems[0],
      tags: [
        {
          id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
          type: ItemTagType.Public,
          item: samplePublicItems[0],
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
        },
      ],
      memberships: [
        {
          item: samplePublicItems[0],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd2a-5688-12db-ae93-0242ac130032',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
        {
          item: samplePublicItems[0],
          permission: PermissionLevel.Read,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd2a-5688-12db-ae91-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...samplePublicItems[1],
      memberships: [
        {
          item: samplePublicItems[1],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd2a-5688-121b-ae93-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...samplePublicItems[2],
      tags: [
        {
          id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
          type: ItemTagType.Public,
          item: samplePublicItems[0],
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
        },
      ],
      memberships: [
        {
          item: samplePublicItems[2],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd1a-5688-12db-ae93-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...samplePublicItems[3],
      tags: [
        {
          type: ItemTagType.Public,
          item: samplePublicItems[3],
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          id: 'ecbfbd2a-9644-12db-ae93-0242ac130002',
        },
      ],
      memberships: [
        {
          item: samplePublicItems[1],
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd2a-5644-12db-ae93-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
        {
          item: samplePublicItems[1],
          permission: PermissionLevel.Read,
          member: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd2a-5338-12db-ae93-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...samplePublicItems[4],
      tags: [
        {
          type: ItemTagType.Public,
          item: samplePublicItems[4],
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          id: 'ecbfbd2a-9644-12db-ae93-0242ac130002',
        },
      ],
    },
    {
      ...samplePublicItems[5],
      tags: [
        {
          type: ItemTagType.Public,
          item: samplePublicItems[5],
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          id: 'ecbfbd2a-9644-12de-ae93-0242ac130002',
        },
      ],
      // memberships: [
      //   {
      //     itemId: 'bdf09f5a-5688-11eb-ae93-0242ac130004',
      //     itemPath: 'bdf09f5a_5688_11eb_ae93_0242ac130004',
      //     permission: PermissionLevel.Admin,
      //     member: MEMBERS.ANNA,
      //   },
      // ],
    },
    samplePublicItems[6],
  ],
};

export const SHORTCUT: ShortcutItemType = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'gcafbd2a-5688-11eb-ae92-0242ac130002',
  name: 'shortcut for own_item_name1',
  path: 'gcafbd2a_5688_11eb_ae92_0242ac130002',
  type: ItemType.SHORTCUT,
  extra: {
    [ItemType.SHORTCUT]: { target: 'gcafbd2a-5681-11eb-ae92-0242ac130002' },
  },
};

export const ITEM_REORDER_ITEMS = {
  parent: {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'parent',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
  },
  children: [
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
      name: 'child1',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
      name: 'child2',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
    },
    {
      ...DEFAULT_FOLDER_ITEM,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130005',
      name: 'child3',
      path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130005',
    },
  ],
};

const item: DiscriminatedItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'parent public item',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
};

export const PUBLISHED_ITEM: ItemForTest = {
  ...item,
  tags: [
    {
      id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
      type: ItemTagType.Public,
      item,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
    },
  ],
  published: {
    id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
    item,
    createdAt: '2021-08-11T12:56:36.834Z',
    creator: MEMBERS.ANNA,
    totalViews: 0,
  },
  memberships: [
    {
      item,
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
      createdAt: '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z',
    },
    {
      item,
      permission: PermissionLevel.Read,
      member: MEMBERS.BOB,
      creator: MEMBERS.ANNA,
      id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
      createdAt: '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z',
    },
  ],
};
export const PUBLISHED_ITEM_VALIDATIONS = [
  {
    id: '65c57d69-0e59-4569-a422-f330c31c995c',
    item: PUBLISHED_ITEM,
    createdAt: '2021-08-11T12:56:36.834Z',
    itemValidations: [
      {
        id: 'id1',
        item: PUBLISHED_ITEM,
        // itemValidationGroup: iVG,
        process: ItemValidationProcess.BadWordsDetection,
        status: ItemValidationStatus.Success,
        result: '',
        updatedAt: new Date('2021-04-13 14:56:34.749946'),
        createdAt: new Date('2021-04-13 14:56:34.749946'),
      },
      {
        id: 'id2',
        item: PUBLISHED_ITEM,
        // itemValidationGroup: iVG,
        process: ItemValidationProcess.ImageChecking,
        status: ItemValidationStatus.Success,
        result: '',
        updatedAt: new Date('2021-04-13 14:56:34.749946'),
        createdAt: new Date('2021-04-13 14:56:34.749946'),
      },
      // todo: fix this issue with circular types
    ] as unknown as ItemValidation[],
  },
];

const hiddenItem: DiscriminatedItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130011',
  name: 'parent hidden public item',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130011',
};
export const HIDDEN_ITEM: ItemForTest = {
  ...hiddenItem,
  tags: [
    {
      id: 'ecbfbd2a-5688-11eb-ae93-0242ac130001',
      type: ItemTagType.Public,
      item: hiddenItem,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
    },
    {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130001',
      type: ItemTagType.Hidden,
      item: hiddenItem,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
    },
  ],
  memberships: [
    {
      item: hiddenItem,
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
      createdAt: '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z',
    },
    {
      item: hiddenItem,
      permission: PermissionLevel.Read,
      member: MEMBERS.BOB,
      creator: MEMBERS.ANNA,
      id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
      createdAt: '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z',
    },
  ],
};

export const CHILD_HIDDEN_ITEM: DiscriminatedItem = {
  ...HIDDEN_ITEM,
  id: 'ecafbd2a-3688-11eb-ae93-0242ac130003',
  name: 'child of hidden item',
  path: `${HIDDEN_ITEM.path}.ecafbd2a_3688_11eb_ae93_0242ac130003`,
};

const pinnedItem: DiscriminatedItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'parent public item',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
};
export const PINNED_ITEM: ItemForTest = {
  ...pinnedItem,
  settings: {
    isPinned: true,
    showChatbox: true,
  },
  memberships: [
    {
      item: pinnedItem,
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      id: 'ecbfbd2a-5688-12db-ae13-0242ac130002',
      createdAt: '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z',
    },
  ],
};

const itemSetting: DiscriminatedItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130003',
  name: 'parent public item',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130003',
};
export const ITEMS_SETTINGS: ApiConfig = {
  items: [
    HIDDEN_ITEM,
    PINNED_ITEM,
    {
      ...itemSetting,
      settings: {
        isPinned: false,
        showChatbox: false,
        enableSaveActions: false,
      },
      memberships: [
        {
          item: itemSetting,
          permission: PermissionLevel.Admin,
          member: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd6a-5688-12db-ae13-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    CHILD_HIDDEN_ITEM,
  ],
};

const itemCCLicenseCCBY: DiscriminatedItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130012',
  name: 'public item with cc by',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130012',
  settings: { ccLicenseAdaption: 'CC BY' },
};
const itemCCLicenseCCBYNC: DiscriminatedItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130022',
  name: 'public item with cc by nc',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130022',
  settings: { ccLicenseAdaption: 'CC BY-NC' },
};
const itemCCLicenseCCBYSA: DiscriminatedItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130032',
  name: 'public item with cc by sa',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130032',
  settings: { ccLicenseAdaption: 'CC BY-SA' },
};
const itemCCLicenseCCBYNCND: DiscriminatedItem = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130042',
  name: 'public item with cc by nc nd',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130042',
  settings: { ccLicenseAdaption: 'CC BY-NC-ND' },
};

export const PUBLISHED_ITEMS_WITH_CC_LICENSE: ItemForTest[] = [
  {
    ...itemCCLicenseCCBY,
    tags: [
      {
        id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
        type: ItemTagType.Public,
        item: itemCCLicenseCCBY,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
    ],
    published: {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
      item: itemCCLicenseCCBY,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
      totalViews: 0,
    },
    memberships: [
      {
        item: itemCCLicenseCCBY,
        permission: PermissionLevel.Admin,
        member: MEMBERS.ANNA,
        creator: MEMBERS.ANNA,
        id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
      {
        item: itemCCLicenseCCBY,
        permission: PermissionLevel.Read,
        member: MEMBERS.BOB,
        creator: MEMBERS.ANNA,
        id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
    ],
  },
  {
    ...itemCCLicenseCCBYNC,
    tags: [
      {
        id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
        type: ItemTagType.Public,
        item: itemCCLicenseCCBYNC,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
    ],
    published: {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
      item: itemCCLicenseCCBYNC,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
      totalViews: 0,
    },
    memberships: [
      {
        item: itemCCLicenseCCBYNC,
        permission: PermissionLevel.Admin,
        member: MEMBERS.ANNA,
        creator: MEMBERS.ANNA,
        id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
      {
        item: itemCCLicenseCCBYNC,
        permission: PermissionLevel.Read,
        member: MEMBERS.BOB,
        creator: MEMBERS.ANNA,
        id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
    ],
  },
  {
    ...itemCCLicenseCCBYSA,
    tags: [
      {
        id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
        type: ItemTagType.Public,
        item: itemCCLicenseCCBYSA,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
    ],
    published: {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
      item: itemCCLicenseCCBYSA,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
      totalViews: 0,
    },
    memberships: [
      {
        item: itemCCLicenseCCBYSA,
        permission: PermissionLevel.Admin,
        member: MEMBERS.ANNA,
        creator: MEMBERS.ANNA,
        id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
      {
        item: itemCCLicenseCCBYSA,
        permission: PermissionLevel.Read,
        member: MEMBERS.BOB,
        creator: MEMBERS.ANNA,
        id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
    ],
  },
  {
    ...itemCCLicenseCCBYNCND,
    tags: [
      {
        id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
        type: ItemTagType.Public,
        item: itemCCLicenseCCBYNCND,
        createdAt: '2021-08-11T12:56:36.834Z',
        creator: MEMBERS.ANNA,
      },
    ],
    published: {
      id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
      item: itemCCLicenseCCBYNCND,
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.ANNA,
      totalViews: 0,
    },
    memberships: [
      {
        item: itemCCLicenseCCBYNCND,
        permission: PermissionLevel.Admin,
        member: MEMBERS.ANNA,
        creator: MEMBERS.ANNA,
        id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
      {
        item: itemCCLicenseCCBYNCND,
        permission: PermissionLevel.Read,
        member: MEMBERS.BOB,
        creator: MEMBERS.ANNA,
        id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
        createdAt: '2021-08-11T12:56:36.834Z',
        updatedAt: '2021-08-11T12:56:36.834Z',
      },
    ],
  },
];
