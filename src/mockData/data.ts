import { FolderItemExtra, Item, ItemLoginSchemaType, ItemSettings, ItemTagType, ItemType, Member, PermissionLevel, ShortcutItemType } from '@graasp/sdk';
import { CURRENT_USER, MEMBERS } from './members';
import { Database } from '../server';



export const DEFAULT_FOLDER_ITEM: {
  extra: FolderItemExtra,
  type: ItemType.FOLDER,
  creator: Member,
  createdAt: Date,
  updatedAt: Date,
  description: string
  settings: ItemSettings
} = {
  extra: { [ItemType.FOLDER]: { childrenOrder: [] } },
  creator: CURRENT_USER,
  type: ItemType.FOLDER,
  createdAt: new Date('2020-01-01T01:01:01Z'),
  updatedAt: new Date('2020-01-02T01:01:01Z'),
  description: 'mydescription',
  settings: {}
};

export const CREATED_ITEM: Partial<Item> = {
  name: 'created item',
  type: ItemType.FOLDER,
  extra: { [ItemType.FOLDER]: { childrenOrder: [] } },
};

export const EDITED_FIELDS = {
  name: 'new name',
};

const sampleItems: Item[] = [
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
    settings: {
      hasThumbnail: false,
    },
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name2',
    path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
    name: 'own_item_name3',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',

  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
    name: 'own_item_name4',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',

  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130005',
    name: 'own_item_name5',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130005',
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130006',
    name: 'own_item_name6',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130006',
  }
]
export const SAMPLE_ITEMS: Database = {
  currentMember: CURRENT_USER,
  items: sampleItems,
  members: Object.values(MEMBERS),
  itemMemberships: [
    {
      item: sampleItems[0],
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      id: 'fdf09f5a-5688-11eb-ae93-0242ac130034',
      creator: MEMBERS.ANNA,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      item: sampleItems[1],
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '2d44caf9-592a-417a-86d3-99432b223c18'
    },
    {
      item: sampleItems[1],
      permission: PermissionLevel.Read,
      member: MEMBERS.BOB,
      creator: MEMBERS.ANNA,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '2d44caf9-598a-417a-86d3-99432b223c18'
    }, {
      item: sampleItems[2],
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '2d44caf9-598a-417b-86d3-99432b223c18'
    }, {
      item: sampleItems[3],
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '2d44caf9-598a-317a-86d3-99432b223c18'
    }, {
      item: sampleItems[4],
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '2dd4caf9-598a-317a-86d3-99432b223c18'
    }, {
      item: sampleItems[5],
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '2dd4caf9-538a-317a-86d3-99432b223c18'
    }
  ],

};

export const generateOwnItems = (number: number): Item[] => {
  const id = (i) => `cafebabe-dead-beef-1234-${`${i}`.padStart(12, '0')}`;
  const path = (i) => id(i).replace(/-/g, '_');

  return Array(number)
    .fill(null)
    .map((_, i) => {
      const item = {
        ...DEFAULT_FOLDER_ITEM,
        id: id(i),
        name: `item ${i}`,
        path: path(i),
      }

      const mId = `dafebabe-dead-beef-1234-${`${i}`.padStart(12, '0')}`;
      return ({
        ...item,
        memberships: [
          {
            item,
            permission: PermissionLevel.Admin,
            member: MEMBERS.ANNA,
            creator: MEMBERS.ANNA,
            createdAt: new Date(),
            updatedAt: new Date(),
            id: mId
          },
        ],
      })
    });
};

const sampleItemsforItemLogin: Item[] = [{
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
  name: 'item login with username',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
}, {
  ...DEFAULT_FOLDER_ITEM,
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
  name: 'no item login',
  path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
}, {

  ...DEFAULT_FOLDER_ITEM,
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
  name: 'child of item login with username',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',

}, {
  ...DEFAULT_FOLDER_ITEM,
  id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
  name: 'item login with username and password',
  path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
}, {

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

}

]
