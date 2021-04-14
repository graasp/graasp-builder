export const HOME_PATH = '/';
export const SHARED_ITEMS_PATH = '/sharedItems';
export const ITEMS_PATH = '/items';
export const buildItemPath = (id = ':itemId') => `${ITEMS_PATH}/${id}`;
