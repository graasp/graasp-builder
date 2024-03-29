import {
  DocumentItemFactory,
  DocumentItemType,
  FolderItemType,
  ItemType,
  buildDocumentExtra,
} from '@graasp/sdk';
import { DEFAULT_LANG } from '@graasp/translations';

import { DEFAULT_FOLDER_ITEM } from './items';
import { CURRENT_USER } from './members';

export const GRAASP_DOCUMENT_ITEM: DocumentItemType = DocumentItemFactory({
  id: 'ecafbd2a-5688-12eb-ae91-0242ac130002',
  type: ItemType.DOCUMENT,
  name: 'graasp text',
  description: 'a description for graasp text',
  path: 'ecafbd2a_5688_12eb_ae93_0242ac130002',
  settings: {},
  createdAt: '2021-08-11T12:56:36.834Z',
  updatedAt: '2021-08-11T12:56:36.834Z',
  lang: DEFAULT_LANG,
  creator: CURRENT_USER,
  extra: buildDocumentExtra({
    content: '<h1>Some Title</h1>',
  }),
});

export const GRAASP_DOCUMENT_BLANK_NAME_ITEM: DocumentItemType =
  DocumentItemFactory({
    id: 'ecafbd2a-5688-12eb-ae91-0242ac130004',
    type: ItemType.DOCUMENT,
    name: '  ',
    description: 'a description for graasp text',
    path: 'ecafbd2a_5688_12eb_ae93_0242ac130002',
    settings: {},
    createdAt: '2021-08-11T12:56:36.834Z',
    updatedAt: '2021-08-11T12:56:36.834Z',
    creator: CURRENT_USER,
    extra: buildDocumentExtra({
      content: '<h1>Some Title</h1>',
    }),
  });

export const GRAASP_DOCUMENT_PARENT_FOLDER: FolderItemType = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'bdf09f5a-5688-11eb-ae93-0242ac130002',
  name: 'graasp document parent',
  path: 'bdf09f5a_5688_11eb_ae93_0242ac130002',
};

export const GRAASP_DOCUMENT_CHILDREN_ITEM: DocumentItemType =
  DocumentItemFactory({
    type: ItemType.DOCUMENT,
    name: 'children graasp text',
    description: 'a description for graasp text',
    creator: CURRENT_USER,
    settings: {},
    createdAt: '2021-08-11T12:56:36.834Z',
    updatedAt: '2021-08-11T12:56:36.834Z',
    extra: buildDocumentExtra({
      content: '<h1>Some Title</h1>',
    }),
    parentItem: GRAASP_DOCUMENT_PARENT_FOLDER,
  });

export const GRAASP_DOCUMENT_ITEMS_FIXTURE = [
  GRAASP_DOCUMENT_ITEM,
  GRAASP_DOCUMENT_PARENT_FOLDER,
  GRAASP_DOCUMENT_CHILDREN_ITEM,
];
