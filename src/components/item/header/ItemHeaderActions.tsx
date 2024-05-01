import { useParams } from 'react-router-dom';

import { Stack } from '@mui/material';

import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';
import { ChatboxButton, MenuButton } from '@graasp/ui';

import EditButton from '@/components/common/EditButton';
import DownloadButton from '@/components/main/DownloadButton';

import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { ITEM_CHATBOX_BUTTON_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import PublishButton from '../../common/PublishButton';
import ShareButton from '../../common/ShareButton';
import { useLayoutContext } from '../../context/LayoutContext';
import ItemMenuContent from '../../main/ItemMenuContent';
import ItemSettingsButton from '../settings/ItemSettingsButton';

const { useItem } = hooks;

const ItemHeaderActions = (): JSX.Element => {
  const { itemId } = useParams();
  const { t: translateBuilder } = useBuilderTranslation();
  const { editingItemId, isChatboxMenuOpen, setIsChatboxMenuOpen } =
    useLayoutContext();

  const { data: item } = useItem(itemId);

  const canWrite = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Write)
    : false;
  const canAdmin = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Admin)
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
          {showEditButton && <EditButton type="iconButton" item={item} />}
          <DownloadButton id={item.id} name={item.name} />

          <ShareButton itemId={item.id} />
          <ChatboxButton
            showChat
            tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE, {
              name: item.name,
            })}
            id={ITEM_CHATBOX_BUTTON_ID}
            onClick={onClickChatbox}
          />
          {canAdmin && <PublishButton itemId={item.id} />}
          {canWrite && <ItemSettingsButton itemId={item.id} />}
          {/* prevent moving from top header to avoid confusion */}
          <MenuButton
            renderMenuItems={ItemMenuContent({
              item,
              // TODO
              canWrite: showEditButton,
              canAdmin,
              canMove: false,
            })}
          />
        </>
      );
    }
    return null;
  };

  return <Stack direction="row">{renderItemActions()}</Stack>;
};

export default ItemHeaderActions;
