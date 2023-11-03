import { CompleteMember, MemberType } from '@graasp/sdk';

import { MemberForTest } from '../support/types';
import { AVATAR_LINK } from './thumbnails/links';

export const SIGNED_OUT_MEMBER: CompleteMember | null = null;

export const MEMBERS: Record<string, MemberForTest> = {
  ANNA: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130002',
    name: 'anna',
    type: MemberType.Individual,
    email: 'anna@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
    extra: {
      lang: 'fr',
      emailFreq: 'never',
      enableSaveActions: false,
    },
  },
  BOB: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130004',
    name: 'bob',
    type: MemberType.Individual,
    email: 'bob@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
    extra: { lang: 'en' },
    // this only exists for test
    thumbnails: AVATAR_LINK,
  },
  CEDRIC: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130006',
    name: 'cedric',
    type: MemberType.Individual,
    extra: {},
    email: 'cedric@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
    // this only exists for test
    thumbnails: AVATAR_LINK,
  },
  DAVID: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130062',
    name: 'david',
    type: MemberType.Individual,
    email: 'david@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
    extra: { lang: 'en' },
  },
  EVAN: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130022',
    name: 'evan',
    type: MemberType.Individual,
    email: 'evan@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
    extra: { lang: 'en' },
  },
  FANNY: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130012',
    name: 'fanny',
    extra: {},
    type: MemberType.Individual,
    email: 'fanny@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
  },
  GARRY: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130412',
    name: 'garry',
    extra: {},
    type: MemberType.Individual,
    email: 'garry@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
  },
};

export const CURRENT_USER = MEMBERS.ANNA;

export const MOCK_SESSIONS = [
  { id: MEMBERS.BOB.id, token: 'bob-token', createdAt: Date.now() },
  {
    id: MEMBERS.CEDRIC.id,
    token: 'cedric-token',
    createdAt: Date.now(),
  },
];
