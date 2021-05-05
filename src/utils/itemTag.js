import { SETTINGS } from '../config/constants';

// eslint-disable-next-line import/prefer-default-export
export const getItemLoginTag = (tags) =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_LOGIN.name);
