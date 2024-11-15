import { DiscriminatedItem, PackedItem } from '@graasp/sdk';
import { ItemBadges } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { BUILDER } from '../../langs/constants';

type ItemStatuses = {
  showChatbox: boolean;
  isPinned: boolean;
  isCollapsible: boolean;
  isHidden: boolean;
  isPublic: boolean;
};

const DEFAULT_ITEM_STATUSES: ItemStatuses = {
  showChatbox: false,
  isPinned: false,
  isCollapsible: false,
  isHidden: false,
  isPublic: false,
};

export type ItemsStatuses = { [key: DiscriminatedItem['id']]: ItemStatuses };

type ChildCompProps = {
  data: DiscriminatedItem;
  itemsStatuses?: ItemsStatuses;
};

export const useItemsStatuses = ({
  items = [],
}: {
  items?: PackedItem[];
}): ItemsStatuses =>
  items.reduce((acc, r) => {
    const { showChatbox, isPinned, isCollapsible } = {
      ...DEFAULT_ITEM_STATUSES,
      ...r.settings,
    };
    const isHidden = Boolean(r.hidden);
    const isPublic = Boolean(r.public);

    return {
      ...acc,
      [r.id]: {
        showChatbox,
        isPinned,
        isCollapsible,
        isHidden,
        isPublic,
      },
    };
  }, {} as ItemsStatuses);

const Badges = ({ itemsStatuses, data: item }: ChildCompProps): JSX.Element => {
  const { t } = useBuilderTranslation();
  // this is useful because the item.id we are looking for may not be present and the itemStatuses will be undefined
  const itemStatuses = itemsStatuses?.[item.id] || DEFAULT_ITEM_STATUSES;
  const { showChatbox, isPinned, isHidden, isPublic, isCollapsible } =
    itemStatuses;
  return (
    <ItemBadges
      isPinned={isPinned}
      isPinnedTooltip={t(BUILDER.STATUS_TOOLTIP_IS_PINNED)}
      isHidden={isHidden}
      isHiddenTooltip={t(BUILDER.STATUS_TOOLTIP_IS_HIDDEN)}
      isPublic={isPublic}
      isPublicTooltip={t(BUILDER.STATUS_TOOLTIP_IS_PUBLIC)}
      isPublishedTooltip={t(BUILDER.STATUS_TOOLTIP_IS_PUBLISHED)}
      isCollapsible={isCollapsible}
      isCollapsibleTooltip={t(BUILDER.STATUS_TOOLTIP_IS_COLLAPSIBLE)}
      showChatbox={showChatbox}
      showChatboxTooltip={t(BUILDER.STATUS_TOOLTIP_SHOW_CHATBOX)}
    />
  );
};

export default Badges;
