import { List } from 'immutable';

import { Item } from '@graasp/sdk';
import { ItemRecord, ItemTagRecord, TagRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { ItemBadges } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  isItemHidden,
  isItemPublic,
  isItemPublished,
} from '../../utils/itemTag';

type ItemStatuses = {
  showChatbox: boolean;
  isPinned: boolean;
  isCollapsible: boolean;
  isHidden: boolean;
  isPublic: boolean;
  isPublished: boolean;
};

const DEFAULT_ITEM_STATUSES: ItemStatuses = {
  showChatbox: false,
  isPinned: false,
  isCollapsible: false,
  isHidden: false,
  isPublic: false,
  isPublished: false,
};

export type ItemsStatuses = { [key: ItemRecord['id']]: ItemStatuses };

export const useItemsStatuses = ({
  items,
  itemsTags,
  tagList,
}: {
  items: List<ItemRecord>;
  itemsTags: List<List<ItemTagRecord>>;
  tagList: List<TagRecord>;
}): ItemsStatuses =>
  items.reduce((acc, r, idx) => {
    const itemTags = itemsTags?.get(idx);
    const { showChatbox, isPinned, isCollapsible } = {
      ...DEFAULT_ITEM_STATUSES,
      // the settings are an immutable
      ...r.settings?.toJS(),
    };
    const isHidden = isItemHidden({ tags: tagList, itemTags });
    const isPublic = isItemPublic({ tags: tagList, itemTags });
    const isPublished = isItemPublished({ tags: tagList, itemTags });
    return {
      ...acc,
      [r.id]: {
        showChatbox,
        isPinned,
        isCollapsible,
        isHidden,
        isPublic,
        isPublished,
      },
    };
  }, {} as ItemsStatuses);

type Props = {
  itemsStatuses: ItemsStatuses;
};

type ChildCompProps = {
  data: Item | ItemRecord;
};

const BadgesCellRenderer = ({
  itemsStatuses,
}: Props): ((arg: ChildCompProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildCompProps) => {
    const { t } = useBuilderTranslation();
    // this is useful because the item.id we are looking for may not be present and the itemStatuses will be undefined
    const itemStatuses = itemsStatuses[item.id] || DEFAULT_ITEM_STATUSES;
    const {
      showChatbox,
      isPinned,
      isHidden,
      isPublic,
      isPublished,
      isCollapsible,
    } = itemStatuses;
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
