import { buildDocumentExtra } from '../../src/utils/itemExtra';
import { ITEM_TYPES } from './enums';
import { DEFAULT_FOLDER_ITEM } from './items';
import { CURRENT_USER } from './members';

export const GRAASP_DOCUMENT_ITEM = {
  id: 'ecafbd2a-5688-12eb-ae91-0242ac130002',
  type: ITEM_TYPES.DOCUMENT,
  name: 'graasp text',
  description: 'a description for graasp text',
  path: 'ecafbd2a_5688_12eb_ae93_0242ac130002',
  creator: CURRENT_USER.id,
  extra: buildDocumentExtra({
    content: '<h1>Some Title</h1>',
  }),
};

export const GRAASP_DOCUMENT_PARENT_FOLDER = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'bdf09f5a-5688-11eb-ae93-0242ac130002',
  name: 'graasp document parent',
  path: 'bdf09f5a_5688_11eb_ae93_0242ac130002',
  extra: {
    image: 'someimageurl',
  },
};

export const GRAASP_DOCUMENT_CHILDREN_ITEM = {
  id: '1cafbd2a-5688-12eb-ae91-0242ac130002',
  type: ITEM_TYPES.DOCUMENT,
  name: 'children graasp text',
  description: 'a description for graasp text',
  path: 'bdf09f5a_5688_11eb_ae93_0242ac130002.1cafbd2a_5688_12eb_ae93_0242ac130002',
  creator: CURRENT_USER.id,
  extra: buildDocumentExtra({
    content: '<h1>Some Title</h1>',
  }),
};

export const GRAASP_DOCUMENT_ITEMS_FIXTURE = [
  GRAASP_DOCUMENT_ITEM,
  GRAASP_DOCUMENT_PARENT_FOLDER,
  GRAASP_DOCUMENT_CHILDREN_ITEM,
];
