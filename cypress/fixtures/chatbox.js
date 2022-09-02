import { DEFAULT_FOLDER_ITEM } from './items';
import { CURRENT_USER, MEMBERS } from './members';

export const ITEM_WITH_CHATBOX_MESSAGES = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'adf09f5a-5688-11eb-ae93-0242ac130004',
  path: 'adf09f5a_5688_11eb_ae93_0242ac130004',
  name: 'item with chatbox messages',
  chat: [
    {
      body: 'message1',
      chatId: 'adf09f5a-5688-11eb-ae93-0242ac130004',
      createdAt: '2021-08-11T12:56:36.834Z',
      creator: CURRENT_USER.id,
    },
    {
      body: 'message2',
      chatId: 'adf09f5a-5688-11eb-ae93-0242ac130004',
      createdAt: '2021-09-11T12:56:36.834Z',
      creator: MEMBERS.BOB.id,
    },
  ],
};

export const ITEM_WITHOUT_CHATBOX_MESSAGES = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'bdf09f5a-5688-11eb-ae93-0242ac130001',
  path: 'bdf09f5a_5688_11eb_ae93_0242ac130001',
  name: 'item without chatbox messages',
  chat: [],
};

export const SAMPLE_MENTIONS = [
  {
    id: "7062d5e6-a4a0-4828-b4b9-8bc9e21f7abd",
    messageId: "3241ca2e-8d79-4d48-b6a9-8124f5a33540",
    memberId: CURRENT_USER.id,
    creator: MEMBERS.BOB.id,
    createdAt: "2022-07-18T07:48:05.008Z",
    updatedAt: "2022-07-18T07:48:05.008Z",
    status: "unread",
    message: "`<!@all>[00000000-0000-4000-8000-000000000000]` this is going to be great !",
  }
]