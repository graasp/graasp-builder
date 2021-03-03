export const HOME_PATH = '/';
export const SHARED_ITEMS_PATH = '/sharedItems';
export const SIGN_IN_PATH = '/signIn';
export const SIGN_UP_PATH = '/signUp';
export const ITEMS_PATH = '/items';
export const buildItemPath = (id = ':id') => `${ITEMS_PATH}/${id}`;
