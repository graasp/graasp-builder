import { FIXTURES_THUMBNAILS_FOLDER } from '../support/constants';

export const SIGNED_OUT_MEMBER = {};

export const MEMBERS = {
  ANNA: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130002',
    name: 'anna',
    email: 'anna@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    extra: {
      lang: 'fr',
    },
  },
  BOB: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130004',
    name: 'bob',
    email: 'bob@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    extra: { lang: 'en' },
    // this only exists for test
    thumbnails: FIXTURES_THUMBNAILS_FOLDER,
  },
  CEDRIC: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130006',
    name: 'cedric',
    email: 'cedric@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    // this only exists for test
    thumbnails: FIXTURES_THUMBNAILS_FOLDER,
  },
  DAVID: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130062',
    name: 'david',
    email: 'david@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    extra: { lang: 'en' },
  },
  EVAN: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130022',
    name: 'evan',
    email: 'evan@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
    extra: { lang: 'en' },
  },
  FANNY: {
    id: 'ecafbd2a-5642-31fb-ae93-0242ac130012',
    name: 'fanny',
    email: 'fanny@email.com',
    createdAt: '2021-04-13 14:56:34.749946',
  },
};

export const CURRENT_USER = MEMBERS.ANNA;

export const buildMemberWithFavorites = (favoriteItems) => ({
  ...CURRENT_USER,
  extra: { ...CURRENT_USER.extra, favoriteItems },
});
