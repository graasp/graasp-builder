import { Stack } from '@mui/material';

import { ItemType } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { ChatboxButton } from '@graasp/ui';

import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { ItemActionTabs } from '../../../enums';
import { isItemUpdateAllowedForUser } from '../../../utils/membership';
import AnalyticsDashboardButton from '../../common/AnalyticsDashboardButton';
import EditItemCaptionButton from '../../common/EditItemCaptionButton';
import ItemMetadataButton from '../../common/ItemMetadataButton';
import PlayerViewButton from '../../common/PlayerViewButton';
import PublishButton from '../../common/PublishButton';
import ShareButton from '../../common/ShareButton';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import { useLayoutContext } from '../../context/LayoutContext';
import ItemSettingsButton from '../settings/ItemSettingsButton';
import ModeButton from './ModeButton';

const { useItemMemberships } = hooks;

type Props = {
  item: ItemRecord;
};

const ItemHeaderActions = ({ item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    editingItemId,
    openedActionTabId,
    isChatboxMenuOpen,
    setIsChatboxMenuOpen,
    setIsItemMetadataMenuOpen,
  } = useLayoutContext();
  const id = item?.id;
  const type = item?.type;

  const { data: member } = useCurrentUserContext();

  const { data: memberships } = useItemMemberships(id);
  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: member?.id,
  });
  const canAdmin = getHighestPermissionForMemberFromMemberships({
    memberships,
    memberId: member?.id,
  });

  const onClickChatbox = () => {
    setIsChatboxMenuOpen(!isChatboxMenuOpen);
    setIsItemMetadataMenuOpen(false);
  };

  const renderItemActions = () => {
    // if id is defined, we are looking at an item
    if (id) {
      // show edition only for allowed types
      const showEditButton =
        !editingItemId && ITEM_TYPES_WITH_CAPTIONS.includes(type) && canEdit;

      const activeActions = (
        <>
          {showEditButton && <EditItemCaptionButton itemId={id} />}
          <ShareButton itemId={id} />
          <ChatboxButton
            tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE)}
            id={ITEM_CHATBOX_BUTTON_ID}
            onClick={onClickChatbox}
          />
          <PlayerViewButton itemId={id} />
          {canAdmin && <PublishButton itemId={id} />}
          {canEdit && <AnalyticsDashboardButton id={id} />}
        </>
      );

      return (
        <>
          {openedActionTabId !== ItemActionTabs.Settings && activeActions}
          {canEdit && <ItemSettingsButton id={id} />}
        </>
      );
    }
    return null;
  };

  return (
    <Stack direction="row">
      {renderItemActions()}
      {
        // show only for content with tables : root or folders
        (type === ItemType.FOLDER || !id) && <ModeButton />
      }
      {id && <ItemMetadataButton />}
    </Stack>
  );
};

export default ItemHeaderActions;
