import { ITEM_TYPES } from '../../src/config/constants';
import { CURRENT_USER } from './members';

const DEFAULT_ITEM = {
  description: '',
  extra: {},
  creator: CURRENT_USER.id,
  type: ITEM_TYPES.SPACE,
};

export const CREATED_ITEM = {
  name: 'created item',
  type: ITEM_TYPES.SPACE,
  description: 'I am a newly created element',
  extra: {
    image: 'someimageurl',
  },
};

export const EDITED_FIELDS = {
  name: 'new name',
  description: 'new description',
};

export const SAMPLE_ITEMS = [
  {
    ...DEFAULT_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
    extra: {
      image: 'someimageurl',
    },
  },
  {
    ...DEFAULT_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name2',
    path: 'fdf09f5a_5688_11eb_ae93_0242ac130002',
    extra: {
      image: 'someimageurl',
    },
  },
  {
    ...DEFAULT_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
    name: 'own_item_name3',
    path:
      'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',
    extra: {
      image: 'someimageurl',
    },
  },
  {
    ...DEFAULT_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130004',
    name: 'own_item_name4',
    path:
      'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130004',
    extra: {
      image: 'someimageurl',
    },
  },
];
