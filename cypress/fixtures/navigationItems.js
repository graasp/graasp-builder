import { buildDocumentExtra } from '../../src/utils/itemExtra';
import { ITEM_TYPES } from './enums';
import { DEFAULT_FOLDER_ITEM } from './items';
import { CURRENT_USER } from './members';

// eslint-disable-next-line import/prefer-default-export
export const FOLDER_WITH_TWO_DOCUMENTS = [
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'ecafbd2a-5688-11eb-ae93-0242ac130002',
    name: 'own_item_name1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002',
    extra: {
      image: 'someimageurl',
    },
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130002',
    name: 'doc1',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130002',

    creator: CURRENT_USER.id,
    extra: buildDocumentExtra({
      content: 'some text',
    }),
    type: ITEM_TYPES.DOCUMENT,
  },
  {
    ...DEFAULT_FOLDER_ITEM,
    id: 'fdf09f5a-5688-11eb-ae93-0242ac130003',
    name: 'doc2',
    path: 'ecafbd2a_5688_11eb_ae93_0242ac130002.fdf09f5a_5688_11eb_ae93_0242ac130003',

    extra: buildDocumentExtra({
      content: 'some text in this item',
    }),
    type: ITEM_TYPES.DOCUMENT,
  },
];
