import { List } from 'immutable';

import { Item } from '@graasp/sdk';
import { ItemRecord, ItemTagRecord, TagRecord } from '@graasp/sdk/frontend';
import { ItemBadges } from '@graasp/ui';

import {
  isItemHidden,
  isItemPublic,
  isItemPublished,
} from '../../utils/itemTag';

type Props = {
  items: List<ItemRecord>;
  manyTags: List<List<ItemTagRecord>>;
  tagList: List<TagRecord>;
};

type ChildCompProps = {
  data: Item;
};

// items and memberships match by index
const BadgesCellRenderer = ({
  manyTags,
  tagList,
  items,
}: Props): ((arg: ChildCompProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildCompProps) => {
    const itemIndex = items.findIndex(({ id }) => id === item.id);
    const itemTags = manyTags.get(itemIndex);

    const isHidden = isItemHidden({ tags: tagList, itemTags });
    const isPublic = isItemPublic({ tags: tagList, itemTags });
    const isPublished = isItemPublished({ tags: tagList, itemTags });
    const isPinned = Boolean(item?.settings?.isPinned);

    return (
      <ItemBadges
        isPinned={isPinned}
        isHidden={isHidden}
        isPublic={isPublic}
        isPublished={isPublished}
      />
    );
  };
  return ChildComponent;
};

export default BadgesCellRenderer;
