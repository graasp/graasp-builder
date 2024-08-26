import { AccountType, CompleteMember, MemberFactory } from '@graasp/sdk';

import { MemberForTest } from '../support/types';
import { AVATAR_LINK } from './thumbnails/links';

export const SIGNED_OUT_MEMBER: CompleteMember | null = null;

export const MEMBERS: Record<string, MemberForTest> = {
  ANNA: MemberFactory({
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130002',
    name: 'anna',
    type: AccountType.Individual,
    email: 'anna@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
    extra: {
      lang: 'fr',
      emailFreq: 'never',
    },
    isValidated: true,
  }),
  BOB: {
    ...MemberFactory({
      id: 'ecafbd2a-5642-31fb-ae93-0242ac130004',
      name: 'bob',
      type: AccountType.Individual,
      email: 'bob@email.com',
      createdAt: '2021-04-13 14:56:34.749946',
      updatedAt: '2021-04-13 14:56:34.749946',
      extra: { lang: 'en' },
    }),
    // this only exists for test
    thumbnails: AVATAR_LINK,
  },
  CEDRIC: {
    ...MemberFactory({
      id: 'ecafbd2a-5642-31fb-ae93-0242ac130006',
      name: 'cedric',
      type: AccountType.Individual,
      extra: {},
      email: 'cedric@email.com',
      createdAt: '2021-04-13 14:56:34.749946',
      updatedAt: '2021-04-13 14:56:34.749946',
    }),

    // this only exists for test
    thumbnails: AVATAR_LINK,
  },
  DAVID: MemberFactory({
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130062',
    name: 'david',
    type: AccountType.Individual,
    email: 'david@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
    extra: { lang: 'en' },
  }),
  EVAN: MemberFactory({
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130022',
    name: 'evan',
    type: AccountType.Individual,
    email: 'evan@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
    extra: { lang: 'en' },
  }),
  FANNY: MemberFactory({
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130012',
    name: 'fanny',
    extra: {},
    type: AccountType.Individual,
    email: 'fanny@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
  }),
  GARRY: MemberFactory({
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130412',
    name: 'garry',
    extra: {},
    type: AccountType.Individual,
    email: 'garry@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    updatedAt: '2021-04-13 14:56:34.749946',
    isValidated: false,
  }),
};

export const CURRENT_USER = MEMBERS.ANNA;
export const NOT_VALIDATED_MEMBER = MEMBERS.GARRY;
export const VALIDATED_MEMBER = MEMBERS.ANNA;
export const LEGACY_NOT_VALIDATED_MEMBER = {
  ...NOT_VALIDATED_MEMBER,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  isValidated: undefined,
};

export const MOCK_SESSIONS = [
  { id: MEMBERS.BOB.id, token: 'bob-token', createdAt: Date.now() },
  {
    id: MEMBERS.CEDRIC.id,
    token: 'cedric-token',
    createdAt: Date.now(),
  },
];
