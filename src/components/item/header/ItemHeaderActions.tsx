import { Stack } from '@mui/material';

import {
  DiscriminatedItem,
  PermissionLevel,
  PermissionLevelCompare,
} from '@graasp/sdk';
import { ActionButton, ChatboxButton } from '@graasp/ui';

import useModalStatus from '@/components/hooks/useModalStatus';
import DownloadButton from '@/components/main/DownloadButton';

import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { ITEM_CHATBOX_BUTTON_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import PublishButton from '../../common/PublishButton';
import ShareButton from '../../common/ShareButton';
import { useLayoutContext } from '../../context/LayoutContext';
import EditButton from '../edit/EditButton';
import EditModal from '../edit/EditModal';
import ItemSettingsButton from '../settings/ItemSettingsButton';
import Actions from './Actions';

const { useItem } = hooks;

type Props = {
  itemId: DiscriminatedItem['id'];
};

const ItemHeaderActions = ({ itemId }: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { editingItemId, isChatboxMenuOpen, setIsChatboxMenuOpen } =
    useLayoutContext();
  const { data: item } = useItem(itemId);
  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModalStatus();

  const canWrite = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Write)
    : false;
  const canAdmin = item?.permission
    ? PermissionLevelCompare.gte(item.permission, PermissionLevel.Admin)
    : false;

  const onClickChatbox = () => {
    setIsChatboxMenuOpen(!isChatboxMenuOpen);
  };

  // if id is defined, we are looking at an item
  if (item && item?.id) {
    // show edition only for allowed types
    const showEditButton =
      !editingItemId &&
      ITEM_TYPES_WITH_CAPTIONS.includes(item.type) &&
      canWrite;

    return (
      <Stack direction="row">
        {showEditButton && (
          <>
            <EditModal
              onClose={closeEditModal}
              open={isEditModalOpen}
              item={item}
            />
            <EditButton
              onClick={openEditModal}
              type={ActionButton.ICON_BUTTON}
              itemId={item.id}
            />
          </>
        )}
        <DownloadButton item={item} />

        <ShareButton itemId={item.id} />
        <ChatboxButton
          showChat={isChatboxMenuOpen}
          tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE, {
            name: item.name,
          })}
          id={ITEM_CHATBOX_BUTTON_ID}
          onClick={onClickChatbox}
        />
        {canAdmin && <PublishButton itemId={item.id} />}
        {canWrite && <ItemSettingsButton itemId={item.id} />}
        {/* prevent moving from top header to avoid confusion */}
        <Actions item={item} />
      </Stack>
    );
  }

  return null;
};

export default ItemHeaderActions;
