import { GRAASP_PERFORM_HOST, H5P_ASSETS_HOST } from './constants';

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
export const buildGraaspPlayerView = (id) => `${GRAASP_PERFORM_HOST}/${id}`;
export const buildGraaspBuilderView = (id) =>
  `${window.location.origin}${buildItemPath(id)}`;
export const RECYCLE_BIN_PATH = '/recycle-bin';
export const H5P_FRAME_JS_PATH = `${H5P_ASSETS_HOST}/frame.bundle.js`;
export const H5P_FRAME_CSS_PATH = `${H5P_ASSETS_HOST}/styles/h5p.css`;
