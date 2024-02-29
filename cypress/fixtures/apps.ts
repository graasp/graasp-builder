import {
  AppItemType,
  FolderItemType,
  ItemType,
  PermissionLevel,
} from '@graasp/sdk';

import { ItemForTest } from '../support/types';
import { APPS_LIST } from './apps/apps';
import { DEFAULT_FOLDER_ITEM } from './items';
import { CURRENT_USER, MEMBERS } from './members';

const API_HOST = Cypress.env('VITE_GRAASP_API_HOST');

export const buildAppApiAccessTokenRoute = (id: string): string =>
  `app-items/${id}/api-access-token`;
export const buildGetAppData = (id: string): string =>
  `app-items/${id}/app-data`;
export const buildAppItemLinkForTest = (filename = '.*'): string =>
  `apps/${filename}`;

export const GRAASP_APP_ITEM: AppItemType = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-12eb-ae91-0272ac130012',
  path: 'ecafbd2a_5688_12eb_ae91_0272ac130012',
  name: 'test app',
  description: 'my app description',
  type: ItemType.APP,
  extra: {
    [ItemType.APP]: { url: APPS_LIST[0].url },
  },
  creator: CURRENT_USER,
};
export const GRAASP_CUSTOM_APP_ITEM: AppItemType = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-12eb-ae91-0272ac130002',
  path: 'ecafbd2a_5688_12eb_ae91_0272ac130002',
  name: 'Add Your Custom App',
  description: 'my app description',
  type: ItemType.APP,
  extra: {
    [ItemType.APP]: { url: APPS_LIST[0].url },
  },
  creator: CURRENT_USER,
};

export const GRAASP_APP_PARENT_FOLDER: FolderItemType = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'bdf09f5a-5688-11eb-ae93-0242ac130002',
  name: 'graasp app parent',
  path: 'bdf09f5a_5688_11eb_ae93_0242ac130002',
};

export const GRAASP_APP_CHILDREN_ITEM: AppItemType = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-12eb-ae91-0272ac130002',
  path: 'bdf09f5a_5688_11eb_ae93_0242ac130002.ecafbd2a_5688_12eb_ae91_0272ac130002',
  name: 'my app',
  description: 'my app description',
  type: ItemType.APP,
  extra: {
    [ItemType.APP]: {
      url: 'http://localhost.com:3333',
    },
  },
  creator: CURRENT_USER,
};
const app: AppItemType = {
  ...DEFAULT_FOLDER_ITEM,
  id: 'ecafbd2a-5688-12eb-ae91-0272ac130002',
  path: 'ecafbd2a_5688_12eb_ae91_0272ac130002',
  name: 'my app',
  description: 'my app description',
  type: ItemType.APP,
  extra: {
    [ItemType.APP]: {
      url: `${API_HOST}/${buildAppItemLinkForTest('app.html')}`,
    },
  },
  creator: CURRENT_USER,
};

export const APP_USING_CONTEXT_ITEM: ItemForTest = {
  ...app,
  memberships: [
    {
      item: app,
      permission: PermissionLevel.Admin,
      member: MEMBERS.ANNA,
      creator: MEMBERS.ANNA,
      createdAt: '2021-08-11T12:56:36.834Z',
      updatedAt: '2021-08-11T12:56:36.834Z',
      id: '2d44cae9-592a-417a-86d3-99432b223c18',
    },
  ],
};

export const GRAASP_APP_ITEMS_FIXTURE = [
  GRAASP_APP_ITEM,
  GRAASP_APP_PARENT_FOLDER,
  GRAASP_APP_CHILDREN_ITEM,
];
