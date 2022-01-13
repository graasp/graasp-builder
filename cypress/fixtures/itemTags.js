import { SETTINGS } from '../../src/config/constants';

export const ITEM_LOGIN_TAG = {
  id: 'item-login-tag-id',
  name: SETTINGS.ITEM_LOGIN.name,
};
export const ITEM_PUBLIC_TAG = {
  id: 'public-tag-id',
  name: SETTINGS.ITEM_PUBLIC.name,
};
export const ITEM_PUBLISHED_TAG = {
  id: 'published-tag-id',
  name: SETTINGS.ITEM_PUBLISHED.name,
};

export const ITEM_HIDDEN_TAG = {
  id: '12345678-1234-1234-1234-123456789012',
};

export const DEFAULT_TAGS = [
  ITEM_LOGIN_TAG,
  ITEM_PUBLIC_TAG,
  ITEM_PUBLISHED_TAG,
];
