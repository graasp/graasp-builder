export const HOME_PATH = '/';
export const SHARED_ITEMS_PATH = '/shared';
export const SIGN_UP_PATH = '/signUp';
export const ITEMS_PATH = '/items';
export const buildItemPath = (id = ':itemId') => `${ITEMS_PATH}/${id}`;
