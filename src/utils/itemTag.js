import { SETTINGS } from '../config/constants';

export const getItemLoginTag = (tags) =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_LOGIN.name);

export const getItemPublicTag = (tags) =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_PUBLIC.name);
