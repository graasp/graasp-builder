import { useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Divider,
  IconButton,
  SwipeableDrawer,
  Typography,
  useTheme,
} from '@mui/material';

import { DiscriminatedItem, PermissionLevel } from '@graasp/sdk';
import { ActionButton, ChatboxButton } from '@graasp/ui';

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
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import { useLayoutContext } from '../../context/LayoutContext';
import MobileItemMenu from '../../main/MobileItemMenu';
import ItemSettingsButton from '../settings/ItemSettingsButton';
import ModeButton from './ModeButton';

const { useItemMemberships } = hooks;

type Props = {
  item?: DiscriminatedItem;
};

// edit
// share
export const MobileItemHeaderActions = ({ item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const {
    editingItemId,
    openedActionTabId,
    isChatboxMenuOpen,
    setIsChatboxMenuOpen,
    setIsItemMetadataMenuOpen,
  } = useLayoutContext();

  const { data: member } = useCurrentUserContext();
  const [isItemActionsDrawerOpen, setIsItemActionsDrawerOpen] = useState(false);
  const theme = useTheme();

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

  const toggleActionsDrawer = () => {
    setIsItemActionsDrawerOpen(!isItemActionsDrawerOpen);
  };
  const closeDrawer = () => setIsItemActionsDrawerOpen(false);
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
          {showEditButton && (
            <EditButton
              item={item}
              onClick={closeDrawer}
              type={ActionButton.MENU_ITEM}
            />
          )}
          <Box width="100%">
            <MobileItemMenu
              item={item}
              canEdit={showEditButton}
              closeDrawer={closeDrawer}
              canAdmin={canAdmin}
            />
          </Box>

          <Divider />
        </>
      );

      return (
        <>
          {openedActionTabId !== ItemActionTabs.Settings && activeActions}

          <DownloadButton
            id={item.id}
            name={item.name}
            type={ActionButton.MENU_ITEM}
            onClick={closeDrawer}
          />
          {canEdit && (
            <ItemSettingsButton
              id={item.id}
              title={translateBuilder(BUILDER.SETTINGS_TITLE)}
              type={ActionButton.MENU_ITEM}
              onClick={closeDrawer}
            />
          )}
        </>
      );
    }
    return null;
  };

  return item ? (
    <>
      <Box display="flex" sx={{ '& button': { padding: 0.5 } }}>
        <ItemMetadataButton />
        <ModeButton />
        <ChatboxButton
          tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE)}
          id={ITEM_CHATBOX_BUTTON_ID}
          onClick={onClickChatbox}
        />
        <IconButton onClick={toggleActionsDrawer}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <SwipeableDrawer
        anchor="bottom"
        open={isItemActionsDrawerOpen}
        onClose={closeDrawer}
        onOpen={() => setIsItemActionsDrawerOpen(true)}
        PaperProps={{ sx: { maxHeight: '80vh', paddingY: 2 } }}
      >
        <Typography px={3} pb={1} variant="h5">
          {item.name}
        </Typography>
        <Divider sx={{ borderColor: theme.palette.grey[400] }} />
        <Box
          display="flex"
          flexDirection="column"
          sx={{ maxHeight: '100%', overflow: 'auto', marginTop: 1 }}
        >
          {renderItemActions()}
        </Box>
      </SwipeableDrawer>
    </>
  ) : (
    <ModeButton />
  );
};

export default MobileItemHeaderActions;
