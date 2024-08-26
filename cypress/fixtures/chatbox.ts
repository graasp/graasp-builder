import {
  ChatMention,
  DiscriminatedItem,
  FolderItemType,
  ItemType,
  MentionStatus,
  PackedFolderItemFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { ItemForTest } from '../support/types';
import { DEFAULT_FOLDER_ITEM } from './items';
import { CURRENT_USER, MEMBERS } from './members';

const item: FolderItemType = {
  ...DEFAULT_FOLDER_ITEM,
  type: ItemType.FOLDER,
  extra: { [ItemType.FOLDER]: {} },
  id: 'adf09f5a-5688-11eb-ae93-0242ac130004',
  path: 'adf09f5a_5688_11eb_ae93_0242ac130004',
  name: 'item with chatbox messages',
  description: 'description',
  settings: {},
};

// warning: permission admin by default
export const ITEM_WITH_CHATBOX_MESSAGES: ItemForTest = {
  ...PackedFolderItemFactory(item),
  memberships: [
    {
      item,
      permission: PermissionLevel.Write,
      account: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      createdAt: '2021-09-11T12:56:36.834Z',
      updatedAt: '2021-09-11T12:56:36.834Z',
      id: '8fa38e9e-0fc4-4359-9cc2-33e73632dde2',
    },
  ],
  chat: [
    {
      id: '62cdf342-b480-4a61-8510-1991fb923912',
      body: 'message1',
      item,
      createdAt: '2021-09-11T12:56:36.834Z',
      updatedAt: '2021-09-11T12:56:36.834Z',
      creator: CURRENT_USER,
    },
    {
      id: '62cdf242-b480-4a61-8510-1991fb923912',
      body: 'message2',
      item,
      createdAt: '2021-09-11T12:56:36.834Z',
      updatedAt: '2021-09-11T12:56:36.834Z',
      creator: MEMBERS.BOB,
    },
  ],
};

const items: DiscriminatedItem[] = [
  {
    ...DEFAULT_FOLDER_ITEM,
    id: '78ad1166-3862-4593-a10c-d380e7b66674',
    path: '78ad1166-3862-4593-a10c-d380e7b66674',
    name: 'item with chatbox messages',
  },
];

const ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN: ItemForTest = {
  ...items[0],
  memberships: [
    {
      item: items[0],
      permission: PermissionLevel.Admin,
      account: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      createdAt: '2021-08-11T12:56:36.834Z',
      id: '78ad2166-3862-4593-a13c-d380e7b66674',
      updatedAt: '2021-08-11T12:56:36.834Z',
    },
  ],
  chat: [
    {
      id: '78ad2166-3862-4593-a10c-d380e7b66674',
      body: 'message1',
      item: items[0],
      createdAt: '2021-08-11T12:56:36.834Z', // '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z', // '2021-08-11T12:56:36.834Z',
      creator: CURRENT_USER,
    },
    {
      id: '78ad1166-3862-1593-a10c-d380e7b66674',
      body: 'message2',
      item: items[0],
      createdAt: '2021-08-11T12:56:36.834Z', // '2021-09-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z', // '2021-08-11T12:56:36.834Z',
      creator: MEMBERS.BOB,
    },
  ],
};

export const ITEM_WITHOUT_CHATBOX_MESSAGES: ItemForTest = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'bdf09f5a-5688-11eb-ae93-0242ac130001',
  path: 'bdf09f5a_5688_11eb_ae93_0242ac130001',
  name: 'item without chatbox messages',
  chat: [],
};

export const SAMPLE_MENTIONS: ChatMention[] = [
  {
    id: '7062d5e6-a4a0-4828-b4b9-8bc9e21f7abd',
    account: CURRENT_USER,
    createdAt: '2021-08-11T12:56:36.834Z', // '2022-07-18T07:48:05.008Z',
    updatedAt: '2021-08-11T12:56:36.834Z', // '2022-07-18T07:48:05.008Z',
    status: MentionStatus.Unread,
    message: {
      ...ITEM_WITH_CHATBOX_MESSAGES_AND_ADMIN.chat?.[0],
      body: '`<!@all>[00000000-0000-4000-8000-000000000000]` this is going to be great !',
    },
  },
];
