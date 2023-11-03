import { ItemTag, ItemTagType } from '@graasp/sdk';

export const isItemHidden = ({ itemTags }: { itemTags?: ItemTag[] }): boolean =>
  Boolean(itemTags?.find(({ type }) => type === ItemTagType.Hidden));

export const isItemPublic = ({ itemTags }: { itemTags?: ItemTag[] }): boolean =>
  Boolean(itemTags?.find(({ type }) => type === ItemTagType.Public));
