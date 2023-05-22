import { List } from 'immutable';

import { Item } from '@graasp/sdk';
import {
  ItemRecord,
  ItemTagRecord,
  ResultOfRecord,
} from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { ItemBadges } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { isItemHidden, isItemPublic } from '../../utils/itemTag';

const { useManyItemPublishedInformations } = hooks;

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

type Props = {
  itemsStatuses?: ItemsStatuses;
};

type ChildCompProps = {
  data: Item | ItemRecord;
};

export const useItemsStatuses = ({
  items = List(),
  itemsTags,
}: {
  items?: List<ItemRecord>;
  itemsTags?: ResultOfRecord<List<ItemTagRecord>>;
}): ItemsStatuses => {
  const { data: publishedInformations } = useManyItemPublishedInformations({
    itemIds: items.map((i) => i.id).toJS(),
  });

  return items.reduce((acc, r) => {
    const itemTags = itemsTags?.data?.get(r.id);
    const { showChatbox, isPinned, isCollapsible } = {
      ...DEFAULT_ITEM_STATUSES,
      // the settings are an immutable
      ...r.settings?.toJS(),
    };
    const isHidden = isItemHidden({ itemTags });
    const isPublic = isItemPublic({ itemTags });
    const isPublished = Boolean(publishedInformations?.data?.get(r.id));

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
};

const BadgesCellRenderer = ({
  itemsStatuses,
}: Props): ((arg: ChildCompProps) => JSX.Element) => {
  const ChildComponent = ({ data: item }: ChildCompProps) => {
    const { t } = useBuilderTranslation();
    // this is useful because the item.id we are looking for may not be present and the itemStatuses will be undefined
    const itemStatuses = itemsStatuses?.[item.id] || DEFAULT_ITEM_STATUSES;
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
