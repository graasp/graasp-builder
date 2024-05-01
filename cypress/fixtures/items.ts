import {
  DiscriminatedItem,
  ItemTagType,
  ItemType,
  ItemValidation,
  ItemValidationGroup,
  ItemValidationProcess,
  ItemValidationStatus,
  PackedFolderItemFactory,
  PackedItem,
  PermissionLevel,
} from '@graasp/sdk';

import { ApiConfig, ItemForTest } from '../support/types';
import { CURRENT_USER, MEMBERS } from './members';

export const DEFAULT_FOLDER_ITEM = PackedFolderItemFactory({
  name: 'default folder',
  extra: { [ItemType.FOLDER]: { childrenOrder: [] } },
  creator: CURRENT_USER,
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

export const SAMPLE_BOOKMARK: ItemBookmark[] = [
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
  const id = (i: number) => {
    const paddedI = `${i}`.padStart(12, '0');
    return `cafebabe-dead-beef-1234-${paddedI}`;
  };
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

      const paddedI = `${i}`.padStart(12, '0');
      const mId = `dafebabe-dead-beef-1234-${paddedI}`;
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

const samplePublicItems: PackedItem[] = [
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
    },
    samplePublicItems[6],
  ],
};

const YESTERDAY_DATE = new Date(Date.now() - 24 * 60 * 60 * 1000);

// warning: admin permission on item
const item = PackedFolderItemFactory(
  {
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'parent public item',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
    updatedAt: YESTERDAY_DATE.toISOString(),
  },
  {
    permission: PermissionLevel.Admin,
    publicTag: { type: ItemTagType.Public },
  },
);

export const PublishedItemFactory = (
  itemToPublish: PackedItem,
): ItemForTest => ({
  ...itemToPublish,
  published: {
    id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
    item,
    createdAt: new Date().toISOString(),
    creator: itemToPublish.creator,
    totalViews: 0,
  },
});

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
    createdAt: new Date().toISOString(),
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
export const PUBLISHED_ITEM_NO_TAGS: ItemForTest = {
  ...PUBLISHED_ITEM,
  settings: {
    ...PUBLISHED_ITEM.settings,
    tags: undefined,
  },
};

export const ItemValidationGroupFactory = (
  validatedItem: DiscriminatedItem,
  {
    status = ItemValidationStatus.Success,
    isOutDated = false,
  }: {
    status?: ItemValidationStatus;
    isOutDated?: boolean;
  } = { status: ItemValidationStatus.Success, isOutDated: false },
): ItemValidationGroup => {
  const itemUpdateDate = new Date(validatedItem.updatedAt);
  const tmp = isOutDated ? -1 : +1;
  const validationDate = new Date(itemUpdateDate);
  validationDate.setDate(validationDate.getDate() + tmp);

  const ivFactory = (id: string, process: ItemValidationProcess) => ({
    id,
    item: validatedItem,
    process,
    status,
    result: '',
    updatedAt: validationDate,
    createdAt: validationDate,
  });

  return {
    id: '65c57d69-0e59-4569-a422-f330c31c995c',
    item: validatedItem,
    createdAt: validationDate.toISOString(),
    itemValidations: [
      ivFactory('id1', ItemValidationProcess.BadWordsDetection),
      ivFactory('id2', ItemValidationProcess.ImageChecking),
    ] as unknown as ItemValidation[],
  };
};

export const PUBLISHED_ITEM_VALIDATIONS = [
  {
    id: '65c57d69-0e59-4569-a422-f330c31c995c',
    item: PUBLISHED_ITEM,
    createdAt: new Date().toISOString(),
    itemValidations: [
      {
        id: 'id1',
        item: PUBLISHED_ITEM,
        // itemValidationGroup: iVG,
        process: ItemValidationProcess.BadWordsDetection,
        status: ItemValidationStatus.Success,
        result: '',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: 'id2',
        item: PUBLISHED_ITEM,
        // itemValidationGroup: iVG,
        process: ItemValidationProcess.ImageChecking,
        status: ItemValidationStatus.Success,
        result: '',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      // todo: fix this issue with circular types
    ] as unknown as ItemValidation[],
  },
];
