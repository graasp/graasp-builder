import { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import { Box, SpeedDial, Stack, styled } from '@mui/material';

import { DiscriminatedItem, ItemType, PermissionLevel } from '@graasp/sdk';
import { ChatboxButton, useMobileView } from '@graasp/ui';

import EditButton from '@/components/common/EditButton';
import DownloadButton from '@/components/main/DownloadButton';

import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import { ITEM_CHATBOX_BUTTON_ID } from '../../../config/selectors';
import { ItemActionTabs } from '../../../enums';
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

const { useItemMemberships } = hooks;

type Props = {
  item?: DiscriminatedItem;
};

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(-2.5),
  left: theme.spacing(-2.5),
  zIndex: 99,
  '& button': {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    color: 'gray',
    background: 'white',
    marginBottom: theme.spacing(1),
    boxShadow: 'none',
  },
  '#itemactions-actions button': {
    boxShadow: theme.shadows[2],
  },
  '& button:hover': {
    color: 'white',
  },
}));
const ItemHeaderActions = ({ item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    editingItemId,
    openedActionTabId,
    isChatboxMenuOpen,
    setIsChatboxMenuOpen,
    setIsItemMetadataMenuOpen,
  } = useLayoutContext();

  const { data: member } = useCurrentUserContext();
  const { isMobile } = useMobileView();
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
          {showEditButton && <EditButton item={item} />}
          {/* prevent moving from top header to avoid confusion */}
          <ItemMenu item={item} canMove={false} canEdit={showEditButton} />

          <ShareButton itemId={item.id} />
          <ChatboxButton
            tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE)}
            id={ITEM_CHATBOX_BUTTON_ID}
            onClick={onClickChatbox}
          />
          {canAdmin && <PublishButton itemId={item.id} />}
        </>
      );
      const isMobileInfoBtns = isMobile && (
        <>
          {item?.type === ItemType.FOLDER && <ModeButton />}
          {item?.id && <ItemMetadataButton />}
        </>
      );
      return (
        <>
          {openedActionTabId !== ItemActionTabs.Settings && activeActions}
          {canEdit && <ItemSettingsButton id={item.id} />}
          <DownloadButton id={item.id} name={item.name} />
          {isMobileInfoBtns}
        </>
      );
    }
    return null;
  };

  if (isMobile) {
    // eslint-disable-next-line no-nested-ternary
    return item ? (
      <Box sx={{ position: 'relative' }}>
        <StyledSpeedDial
          ariaLabel="item actions"
          icon={<SettingsIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction="down"
        >
          {open && renderItemActions()}
        </StyledSpeedDial>
      </Box>
    ) : (
      <ModeButton />
    );
  }
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
