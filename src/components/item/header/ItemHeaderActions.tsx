import { useParams } from 'react-router-dom';

import { Stack } from '@mui/material';

import { ItemType, PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';
import { ChatboxButton } from '@graasp/ui';

import EditButton from '@/components/common/EditButton';
import DownloadButton from '@/components/main/DownloadButton';
import { useGetPermissionForItem } from '@/hooks/authorization';

import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { ITEM_CHATBOX_BUTTON_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import PublishButton from '../../common/PublishButton';
import ShareButton from '../../common/ShareButton';
import { useLayoutContext } from '../../context/LayoutContext';
import ItemMenu from '../../main/ItemMenu';
import ItemSettingsButton from '../settings/ItemSettingsButton';
import ModeButton from './ModeButton';

const { useItem } = hooks;

const ItemHeaderActions = (): JSX.Element => {
  const { itemId } = useParams();
  const { t: translateBuilder } = useBuilderTranslation();
  const { editingItemId, isChatboxMenuOpen, setIsChatboxMenuOpen } =
    useLayoutContext();

  const { data: item } = useItem(itemId);

  const { data: permission } = useGetPermissionForItem(item);
  const canWrite = permission
    ? PermissionLevelCompare.gte(permission, PermissionLevel.Write)
    : false;
  const canAdmin = permission
    ? PermissionLevelCompare.gte(permission, PermissionLevel.Admin)
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
        canWrite;

      return (
        <>
          {showEditButton && <EditButton item={item} />}
          <DownloadButton id={item.id} name={item.name} />
          {/* prevent moving from top header to avoid confusion */}
          <ItemMenu
            item={item}
            canMove={false}
            canAdmin={canAdmin}
            canWrite={showEditButton}
          />

          <ShareButton itemId={item.id} />
          <ChatboxButton
            showChat
            tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE)}
            id={ITEM_CHATBOX_BUTTON_ID}
            onClick={onClickChatbox}
          />
          {canAdmin && <PublishButton itemId={item.id} />}
          {canWrite && <ItemSettingsButton id={item.id} />}
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
    </Stack>
  );
};

export default ItemHeaderActions;
