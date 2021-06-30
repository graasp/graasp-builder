export const HOME_PATH = '/';
export const SHARED_ITEMS_PATH = '/shared';
export const SIGN_UP_PATH = '/signUp';
export const ITEMS_PATH = '/items';
export const buildItemPath = (id = ':itemId') => `${ITEMS_PATH}/${id}`;
export const REDIRECT_PATH = '/redirect';
export const MEMBER_PROFILE_PATH = '/profile';
export const buildItemSettingsPath = (id = ':itemId') =>
  `${ITEMS_PATH}/${id}/settings`;
