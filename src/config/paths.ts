import { ItemLayoutMode } from '@/enums';

export const HOME_PATH = '/';
export const BOOKMARKED_ITEMS_PATH = '/bookmarks';
export const PUBLISHED_ITEMS_PATH = '/published';
export const SIGN_UP_PATH = '/signUp';
export const ITEMS_PATH = '/items';
export const buildItemPath = (
  id = ':itemId',
  args: { mode?: ItemLayoutMode } = {},
): string => {
  const search = new URLSearchParams();
  if (args.mode) {
    search.set('mode', args.mode);
  }
  const qs = search.toString().length ? `?${search.toString()}` : '';
  return `${ITEMS_PATH}/${id}${qs}`;
};
export const REDIRECT_PATH = '/redirect';
export const MEMBER_PROFILE_PATH = '/profile';
export const RECYCLE_BIN_PATH = '/recycle-bin';
export const ITEM_ID_PARAMS = 'itemId';
export const ITEM_SHARE_PATH = 'share';
export const ITEM_PUBLISH_PATH = 'publish';
export const ITEM_SETTINGS_PATH = 'settings';
export const MAP_ITEMS_PATH = 'map';
export const buildItemSettingsPath = (id = ':itemId'): string =>
  `${ITEMS_PATH}/${id}/${ITEM_SETTINGS_PATH}`;
export const buildItemSharePath = (id = ':itemId'): string =>
  `${ITEMS_PATH}/${id}/${ITEM_SHARE_PATH}`;
export const buildItemPublishPath = (id = ':itemId'): string =>
  `${ITEMS_PATH}/${id}/${ITEM_PUBLISH_PATH}`;
