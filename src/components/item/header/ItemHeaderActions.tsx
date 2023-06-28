import { Stack } from '@mui/material';

import { Item, ItemType, PermissionLevel } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { ChatboxButton } from '@graasp/ui';

import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { ITEM_CHATBOX_BUTTON_ID } from '../../../config/selectors';
import { ItemActionTabs } from '../../../enums';
import {
  getHighestPermissionForMemberFromMemberships,
  isItemUpdateAllowedForUser,
} from '../../../utils/membership';
import EditItemCaptionButton from '../../common/EditItemCaptionButton';
import ItemMetadataButton from '../../common/ItemMetadataButton';
import PublishButton from '../../common/PublishButton';
import ShareButton from '../../common/ShareButton';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import { useLayoutContext } from '../../context/LayoutContext';
import ItemMenu from '../../main/ItemMenu';
import ItemSettingsButton from '../settings/ItemSettingsButton';
import ModeButton from './ModeButton';

const { useItemMemberships } = hooks;

type Props = {
  item?: ItemRecord;
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

  const { data: member } = useCurrentUserContext();

  const { data: memberships } = useItemMemberships(item?.id);
  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: member?.id,
  });
  const canAdmin = member?.id
    ? getHighestPermissionForMemberFromMemberships({
        memberships,
        memberId: member?.id,
      })?.permission === PermissionLevel.Admin
    : false;

  const onClickChatbox = () => {
    setIsChatboxMenuOpen(!isChatboxMenuOpen);
    setIsItemMetadataMenuOpen(false);
  };

  const renderItemActions = () => {
    // if id is defined, we are looking at an item
    if (item && item?.id) {
      // show edition only for allowed types
      const showEditButton =
        !editingItemId &&
        ITEM_TYPES_WITH_CAPTIONS.includes(item.type) &&
        canEdit;

      const activeActions = (
        <>
          {showEditButton && <EditItemCaptionButton itemId={item.id} />}
          <ItemMenu item={item.toJS() as Item} canEdit={showEditButton} />

          <ShareButton itemId={item.id} />
          <ChatboxButton
            tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE)}
            id={ITEM_CHATBOX_BUTTON_ID}
            onClick={onClickChatbox}
          />
          {canAdmin && <PublishButton itemId={item.id} />}
        </>
      );

      return (
        <>
          {openedActionTabId !== ItemActionTabs.Settings && activeActions}
          {canEdit && <ItemSettingsButton id={item.id} />}
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
        (item?.type === ItemType.FOLDER || !item?.id) && <ModeButton />
      }
      {item?.id && <ItemMetadataButton />}
    </Stack>
  );
};

export default ItemHeaderActions;
