import { GRAASP_ANALYZER_HOST, GRAASP_PLAYER_HOST } from './env';

export const HOME_PATH = '/';
export const SHARED_ITEMS_PATH = '/shared';
export const FAVORITE_ITEMS_PATH = '/favorite';
export const PUBLISHED_ITEMS_PATH = '/published';
export const SIGN_UP_PATH = '/signUp';
export const ITEMS_PATH = '/items';
export const buildItemPath = (id = ':itemId'): string => `${ITEMS_PATH}/${id}`;
export const REDIRECT_PATH = '/redirect';
export const MEMBER_PROFILE_PATH = '/profile';
export const buildItemSettingsPath = (id = ':itemId'): string =>
  `${ITEMS_PATH}/${id}/settings`;
export const buildGraaspPlayerView = (id: string): string =>
  `${GRAASP_PLAYER_HOST}/${id}`;
export const buildGraaspBuilderView = (id: string): string =>
  `${window.location.origin}${buildItemPath(id)}`;
export const RECYCLE_BIN_PATH = '/recycle-bin';
export const buildGraaspAnalyzerLink = (id: string): string =>
  `${GRAASP_ANALYZER_HOST}/embedded/${id}`;
