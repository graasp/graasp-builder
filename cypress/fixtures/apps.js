import { ITEM_TYPES } from '../../src/config/enum';
import { DEFAULT_FOLDER_ITEM } from './items';
import { CURRENT_USER } from './members';

export const GRAASP_APP_ITEM = {
  id: 'ecafbd2a-5688-12eb-ae91-0272ac130002',
  path: 'ecafbd2a_5688_12eb_ae91_0272ac130002',
  name: 'my app',
  description: 'my app description',
  type: ITEM_TYPES.APP,
  extra: {
    [ITEM_TYPES.APP]: { url: 'http://localhost:3333' },
  },
  creator: CURRENT_USER.id,
};

export const GRAASP_APP_PARENT_FOLDER = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'bdf09f5a-5688-11eb-ae93-0242ac130002',
  name: 'graasp app parent',
  path: 'bdf09f5a_5688_11eb_ae93_0242ac130002',
  extra: {
    image: 'someimageurl',
  },
};

export const GRAASP_APP_CHILDREN_ITEM = {
  id: 'ecafbd2a-5688-12eb-ae91-0272ac130002',
  path:
    'bdf09f5a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_12eb_ae91_0272ac130002',
  name: 'my app',
  description: 'my app description',
  type: ITEM_TYPES.APP,
  extra: {
    [ITEM_TYPES.APP]: { url: 'http://localhost:3333' },
  },
  creator: CURRENT_USER.id,
};

export const GRAASP_APP_ITEMS_FIXTURE = [
  GRAASP_APP_ITEM,
  GRAASP_APP_PARENT_FOLDER,
  GRAASP_APP_CHILDREN_ITEM,
];
