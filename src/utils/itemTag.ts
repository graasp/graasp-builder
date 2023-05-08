import { List } from 'immutable';

import { ItemTagRecord, TagRecord } from '@graasp/sdk/frontend';

import { SETTINGS } from '../config/constants';

export const getItemLoginTag = (tags: List<TagRecord>): TagRecord =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_LOGIN.name);

export const getTagByName = (tags: List<TagRecord>, name: string): TagRecord =>
  tags?.find(({ name: thisName }) => thisName === name);

export const hasItemLoginEnabled = ({
  tags,
  itemTags,
}: {
  tags: List<TagRecord>;
  itemTags: List<ItemTagRecord>;
}): boolean =>
  Boolean(itemTags?.find(({ tagId }) => tagId === getItemLoginTag(tags)?.id));

export const getVisibilityTagAndItemTag = ({
  tags,
  itemTags,
}: {
  tags: List<TagRecord>;
  itemTags: List<ItemTagRecord>;
}): {
  tag: TagRecord;
  itemTag: ItemTagRecord;
} => {
  const tagIds = [
    getTagByName(tags, SETTINGS.ITEM_PUBLIC.name)?.id,
    getTagByName(tags, SETTINGS.ITEM_LOGIN.name)?.id,
  ];
  const visibilityItemTags = itemTags?.filter(({ tagId }) =>
    tagIds.includes(tagId),
  );
  const sorted = visibilityItemTags.sort(
    (a, b) => tagIds.indexOf(a.tagId) - tagIds.indexOf(b.tagId),
  );
  const bestVisibilityItemTag = sorted?.get(0);
  const visibilityTagValue = tags.find(
    ({ id }) => id === bestVisibilityItemTag?.tagId,
  );
  // return best visibility tag
  return { itemTag: bestVisibilityItemTag, tag: visibilityTagValue };
};

export const isItemHidden = ({
  tags,
  itemTags,
}: {
  tags: List<TagRecord>;
  itemTags: List<ItemTagRecord>;
}): boolean =>
  Boolean(
    itemTags?.find(({ tagId }) => tagId === getTagByName(tags, 'hidden')?.id),
  );

export const getItemPublicTag = (tags: List<TagRecord>): TagRecord =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_PUBLIC.name);

export const isItemPublic = ({
  tags,
  itemTags,
}: {
  tags: List<TagRecord>;
  itemTags: List<ItemTagRecord>;
}): boolean =>
  Boolean(itemTags?.find(({ tagId }) => tagId === getItemPublicTag(tags)?.id));

export const getItemPublishedTag = (tags: List<TagRecord>): TagRecord =>
  tags?.find(({ name }) => name === SETTINGS.ITEM_PUBLISHED.name);

export const isItemPublished = ({
  tags,
  itemTags,
}: {
  tags: List<TagRecord>;
  itemTags: List<ItemTagRecord>;
}): boolean =>
  Boolean(
    itemTags?.find(({ tagId }) => tagId === getItemPublishedTag(tags)?.id),
  );
