import { List } from 'immutable';

import { Item } from '@graasp/sdk';
import { ItemRecord, TagRecord } from '@graasp/sdk/frontend';
import { ItemBadges } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import {
  isItemHidden,
  isItemPublic,
  isItemPublished,
} from '../../utils/itemTag';

type Props = {
  tagList: List<TagRecord>;
};

type ChildCompProps = {
  data: Item | ItemRecord;
};

// items and memberships match by index
const BadgesCellRenderer = ({
  tagList,
}: Props): ((arg: ChildCompProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildCompProps) => {
    const { data: itemTags } = hooks.useItemTags(item.id);

    const isHidden = isItemHidden({ tags: tagList, itemTags });
    const isPublic = isItemPublic({ tags: tagList, itemTags });
    const isPublished = isItemPublished({ tags: tagList, itemTags });
    const isPinned = Boolean(item?.settings?.isPinned);
    const isCollapsible = Boolean(item?.settings?.isCollapsible);
    const showChatbox = Boolean(item?.settings?.showChatbox);

    return (
      <ItemBadges
        isPinned={isPinned}
        isHidden={isHidden}
        isPublic={isPublic}
        isPublished={isPublished}
        isCollapsible={isCollapsible}
        showChatbox={showChatbox}
      />
    );
  };
  return ChildComponent;
};

export default BadgesCellRenderer;
