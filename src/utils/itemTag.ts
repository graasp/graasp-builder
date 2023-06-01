import { List } from 'immutable';

import { ItemTagType } from '@graasp/sdk';
import { ItemTagRecord } from '@graasp/sdk/frontend';

export const isItemHidden = ({
  itemTags,
}: {
  itemTags?: List<ItemTagRecord>;
}): boolean =>
  Boolean(itemTags?.find(({ type }) => type === ItemTagType.Hidden));

export const isItemPublic = ({
  itemTags,
}: {
  itemTags?: List<ItemTagRecord>;
}): boolean =>
  Boolean(itemTags?.find(({ type }) => type === ItemTagType.Public));
