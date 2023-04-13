import { List } from 'immutable';

import { Item } from '@graasp/sdk';
import { ItemRecord, TagRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { ItemBadges } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
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
    const { t } = useBuilderTranslation();
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
        isPinnedTooltip={t(BUILDER.STATUS_TOOLTIP_IS_PINNED)}
        isHidden={isHidden}
        isHiddenTooltip={t(BUILDER.STATUS_TOOLTIP_IS_HIDDEN)}
        isPublic={isPublic}
        isPublicTooltip={t(BUILDER.STATUS_TOOLTIP_IS_PUBLIC)}
        isPublished={isPublished}
        isPublishedTooltip={t(BUILDER.STATUS_TOOLTIP_IS_PUBLISHED)}
        isCollapsible={isCollapsible}
        isCollapsibleTooltip={t(BUILDER.STATUS_TOOLTIP_IS_COLLAPSIBLE)}
        showChatbox={showChatbox}
        showChatboxTooltip={t(BUILDER.STATUS_TOOLTIP_SHOW_CHATBOX)}
      />
    );
  };
  return ChildComponent;
};

export default BadgesCellRenderer;
