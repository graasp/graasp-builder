import { Stack } from '@mui/material';

import { ItemType, PermissionLevel } from '@graasp/sdk';
import { ChatboxButton, useShortenURLParams } from '@graasp/ui';

import EditButton from '@/components/common/EditButton';
import DownloadButton from '@/components/main/DownloadButton';
import { ITEM_ID_PARAMS } from '@/config/paths';

import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { ITEM_CHATBOX_BUTTON_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import {
  getHighestPermissionForMemberFromMemberships,
  isItemUpdateAllowedForUser,
} from '../../../utils/membership';
import ItemMetadataButton from '../../common/ItemMetadataButton';
import PublishButton from '../../common/PublishButton';
import ShareButton from '../../common/ShareButton';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import { useLayoutContext } from '../../context/LayoutContext';
import ItemMenu from '../../main/ItemMenu';
import ItemSettingsButton from '../settings/ItemSettingsButton';
import ModeButton from './ModeButton';

const { useItemMemberships, useItem } = hooks;

const ItemHeaderActions = (): JSX.Element => {
  const itemId = useShortenURLParams(ITEM_ID_PARAMS);
  const { t: translateBuilder } = useBuilderTranslation();

  const { editingItemId, isChatboxMenuOpen, setIsChatboxMenuOpen } =
    useLayoutContext();

  const { data: member } = useCurrentUserContext();
  const { data: item } = useItem(itemId);

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
  };

  const renderItemActions = () => {
    // if id is defined, we are looking at an item
    if (item && item?.id) {
      // show edition only for allowed types
      const showEditButton =
        !editingItemId &&
        ITEM_TYPES_WITH_CAPTIONS.includes(item.type) &&
        canEdit;

      const shareActions = (
        <>
          <ShareButton itemId={item.id} />
          {canAdmin && <PublishButton itemId={item.id} />}
        </>
      );
      const activeActions = (
        <>
          {showEditButton && <EditButton item={item} />}
          <ItemMenu
            item={item}
            canMove={false}
            canEdit={showEditButton}
            canAdmin={canAdmin}
          />

          {shareActions}

          <ChatboxButton
            tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE)}
            id={ITEM_CHATBOX_BUTTON_ID}
            onClick={onClickChatbox}
          />
        </>
      );

      return (
        <>
          {activeActions}
          <DownloadButton id={item.id} name={item.name} />
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
      {item?.id && <ItemMetadataButton itemId={item.id} />}
    </Stack>
  );
};

export default ItemHeaderActions;
