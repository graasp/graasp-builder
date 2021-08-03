import { SETTINGS } from '../config/constants';

export const getItemLoginTag = (tags) =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_LOGIN.name);

export const hasItemLoginEnabled = ({ tags, itemTags }) =>
  Boolean(itemTags?.find(({ tagId }) => tagId === getItemLoginTag(tags)?.id));

export const getItemPublicTag = (tags) =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_PUBLIC.name);

export const isItemPublic = ({ tags, itemTags }) =>
  Boolean(itemTags?.find(({ tagId }) => tagId === getItemPublicTag(tags)?.id));
