import {
  DiscriminatedItem,
  ItemType,
  ItemValidation,
  ItemValidationGroup,
  ItemValidationProcess,
  ItemValidationStatus,
  ItemVisibilityType,
  PackedFolderItemFactory,
  PackedItem,
  PermissionLevel,
} from '@graasp/sdk';

import { ApiConfig, ItemForTest } from '../support/types';
import { CURRENT_USER, MEMBERS } from './members';

export const DEFAULT_FOLDER_ITEM = PackedFolderItemFactory({
  name: 'default folder',
  extra: { [ItemType.FOLDER]: {} },
  creator: CURRENT_USER,
});

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
            account: MEMBERS.ANNA,
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
      visibilities: [
        {
          id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
          type: ItemVisibilityType.Public,
          item: samplePublicItems[0],
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
        },
      ],
      memberships: [
        {
          item: samplePublicItems[0],
          permission: PermissionLevel.Admin,
          account: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd2a-5688-12db-ae93-0242ac130032',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
        {
          item: samplePublicItems[0],
          permission: PermissionLevel.Read,
          account: MEMBERS.BOB,
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
          account: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd2a-5688-121b-ae93-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...samplePublicItems[2],
      visibilities: [
        {
          id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
          type: ItemVisibilityType.Public,
          item: samplePublicItems[0],
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
        },
      ],
      memberships: [
        {
          item: samplePublicItems[2],
          permission: PermissionLevel.Admin,
          account: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd1a-5688-12db-ae93-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...samplePublicItems[3],
      visibilities: [
        {
          type: ItemVisibilityType.Public,
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
          account: MEMBERS.ANNA,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd2a-5644-12db-ae93-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
        {
          item: samplePublicItems[1],
          permission: PermissionLevel.Read,
          account: MEMBERS.BOB,
          creator: MEMBERS.ANNA,
          id: 'ecbfbd2a-5338-12db-ae93-0242ac130002',
          createdAt: '2021-08-11T12:56:36.834Z',
          updatedAt: '2021-08-11T12:56:36.834Z',
        },
      ],
    },
    {
      ...samplePublicItems[4],
      visibilities: [
        {
          type: ItemVisibilityType.Public,
          item: samplePublicItems[4],
          creator: MEMBERS.ANNA,
          createdAt: '2021-08-11T12:56:36.834Z',
          id: 'ecbfbd2a-9644-12db-ae93-0242ac130002',
        },
      ],
    },
    {
      ...samplePublicItems[5],
      visibilities: [
        {
          type: ItemVisibilityType.Public,
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
    publicVisibility: { type: ItemVisibilityType.Public },
  },
);

export const PublishedItemFactory = (
  itemToPublish: PackedItem,
): ItemForTest => ({
  ...itemToPublish,
  published: {
    id: 'ecbfbd2a-5688-12eb-ae93-0242ac130002',
    item: itemToPublish,
    createdAt: new Date().toISOString(),
    creator: itemToPublish.creator,
    totalViews: 0,
  },
});

export const PUBLISHED_ITEM: ItemForTest = {
  ...item,
  visibilities: [
    {
      id: 'ecbfbd2a-5688-11eb-ae93-0242ac130002',
      type: ItemVisibilityType.Public,
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
      account: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      id: 'ecbfbd2a-5688-12db-ae93-0242ac130002',
      createdAt: '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z',
    },
    {
      item,
      permission: PermissionLevel.Read,
      account: MEMBERS.BOB,
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
