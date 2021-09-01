import { GRAASP_PERFORM_HOST } from './constants';

export const HOME_PATH = '/';
export const SHARED_ITEMS_PATH = '/shared';
export const FAVORITE_ITEMS_PATH = '/favorite';
export const SIGN_UP_PATH = '/signUp';
export const ITEMS_PATH = '/items';
export const buildItemPath = (id = ':itemId') => `${ITEMS_PATH}/${id}`;
export const REDIRECT_PATH = '/redirect';
export const MEMBER_PROFILE_PATH = '/profile';
export const buildItemSettingsPath = (id = ':itemId') =>
  `${ITEMS_PATH}/${id}/settings`;
export const buildGraaspPerformView = (id) => `${GRAASP_PERFORM_HOST}/${id}`;
export const buildGraaspComposeView = (id) =>
  `${window.location.origin}${buildItemPath(id)}`;
export const RECYCLE_BIN_PATH = '/recycle-bin';
