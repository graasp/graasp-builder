import {
  AppItemType,
  FolderItemType,
  ItemType,
  PackedAppItemFactory,
  PackedFolderItemFactory,
} from '@graasp/sdk';

import { APPS_LIST } from './apps/apps';
import { CURRENT_USER } from './members';

export const buildAppApiAccessTokenRoute = (id: string): string =>
  `app-items/${id}/api-access-token`;
export const buildGetAppData = (id: string): string =>
  `app-items/${id}/app-data`;
export const buildAppItemLinkForTest = (filename = '.*'): string =>
  `apps/${filename}`;

export const GRAASP_APP_ITEM: AppItemType = PackedAppItemFactory({
  name: 'test app',
  extra: {
    [ItemType.APP]: { url: APPS_LIST[0].url },
  },
  creator: CURRENT_USER,
});
export const GRAASP_CUSTOM_APP_ITEM: AppItemType = PackedAppItemFactory({
  name: 'Add Your Custom App',
  extra: {
    [ItemType.APP]: { url: APPS_LIST[0].url },
  },
  creator: CURRENT_USER,
});

export const GRAASP_APP_PARENT_FOLDER: FolderItemType = PackedFolderItemFactory(
  {
    name: 'graasp app parent',
  },
);

export const GRAASP_APP_CHILDREN_ITEM: AppItemType = PackedAppItemFactory({
  name: 'my app',
  extra: {
    [ItemType.APP]: {
      url: 'http://localhost.com:3333',
    },
  },
  creator: CURRENT_USER,
  parentItem: GRAASP_APP_PARENT_FOLDER,
});

export const GRAASP_APP_ITEMS_FIXTURE = [
  GRAASP_APP_ITEM,
  GRAASP_APP_PARENT_FOLDER,
  GRAASP_APP_CHILDREN_ITEM,
];
