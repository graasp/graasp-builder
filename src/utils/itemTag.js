import { SETTINGS } from '../config/constants';

export const getItemLoginTag = (tags) =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_LOGIN.name);

export const getTagByName = (tags, name) =>
  tags?.find(({ name: thisName }) => thisName === name);

export const hasItemLoginEnabled = ({ tags, itemTags }) =>
  Boolean(itemTags?.find(({ tagId }) => tagId === getItemLoginTag(tags)?.id));

export const getVisibilityTagAndItemTag = ({ tags, itemTags }) => {
  const tagIds = [
    getTagByName(tags, SETTINGS.ITEM_PUBLISHED.name)?.id,
    getTagByName(tags, SETTINGS.ITEM_PUBLIC.name)?.id,
    getTagByName(tags, SETTINGS.ITEM_LOGIN.name)?.id,
  ];
  const visibilityItemTags = itemTags?.filter(({ tagId }) =>
    tagIds.includes(tagId),
  );
  const bestVisibilityItemTag = visibilityItemTags
    .sort((a, b) => tagIds.indexOf(a.id) - tagIds.indexOf(b.id))
    ?.get(0);
  const visibilityTagValue = tags.find(
    ({ id }) => id === bestVisibilityItemTag?.tagId,
  );
  // return best visibility tag
  return { itemTag: bestVisibilityItemTag, tag: visibilityTagValue };
};

export const getItemPublicTag = (tags) =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_PUBLIC.name);

export const isItemPublic = ({ tags, itemTags }) =>
  Boolean(itemTags?.find(({ tagId }) => tagId === getItemPublicTag(tags)?.id));
