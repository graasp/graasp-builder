import { useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Divider,
  IconButton,
  Stack,
  SwipeableDrawer,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { DiscriminatedItem, ItemType, PermissionLevel } from '@graasp/sdk';
import { ChatboxButton } from '@graasp/ui';

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
import MobileItemMenu from '../../main/MobileItemMenu';
import ItemSettingsButton from '../settings/ItemSettingsButton';
import ModeButton from './ModeButton';

const { useItemMemberships } = hooks;

type Props = {
  item?: DiscriminatedItem;
};

// a way to expand button to include the text
const StyledBox = styled(Box)(() => ({
  '& span': {
    maxWidth: '20px',
  },
  '& button': {
    paddingRight: '100px',
  },
}));

type ButtonWithTextProps = {
  children: JSX.Element;
  isMobile: boolean;
  text: string;
  onClick: () => void;
};

const IconButtonWithText = ({
  children,
  isMobile,
  text,
  onClick,
}: ButtonWithTextProps): JSX.Element =>
  isMobile ? (
    <StyledBox
      onClick={onClick}
      p="6px 11px"
      display="flex"
      alignItems="center"
      gap={3}
    >
      {children} {text}
    </StyledBox>
  ) : (
    children
  );
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
  const [isItemActionsDrawerOpen, setIsItemActionsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

      const shareActions = (
        <>
          <IconButtonWithText
            isMobile={isMobile}
            text={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
            onClick={closeDrawer}
          >
            <ShareButton itemId={item.id} />
          </IconButtonWithText>
          {canAdmin && (
            <IconButtonWithText
              isMobile={isMobile}
              text={translateBuilder(BUILDER.LIBRARY_SETTINGS_BUTTON_TITLE)}
              onClick={closeDrawer}
            >
              <PublishButton itemId={item.id} />
            </IconButtonWithText>
          )}
        </>
      );
      const activeActions = (
        <>
          {showEditButton && (
            <IconButtonWithText
              isMobile={isMobile}
              text={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
              onClick={closeDrawer}
            >
              <EditButton item={item} />
            </IconButtonWithText>
          )}
          <Box width="100%">
            {isMobile ? (
              <MobileItemMenu
                item={item}
                canMove={false}
                canEdit={showEditButton}
              >
                {shareActions}
              </MobileItemMenu>
            ) : (
              <ItemMenu item={item} canMove={false} canEdit={showEditButton} />
            )}
          </Box>

          {!isMobile && shareActions}
          {isMobile && <Divider />}
          {!isMobile && (
            <ChatboxButton
              tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE)}
              id={ITEM_CHATBOX_BUTTON_ID}
              onClick={onClickChatbox}
            />
          )}
        </>
      );

      return (
        <>
          {openedActionTabId !== ItemActionTabs.Settings && activeActions}
          <IconButtonWithText
            isMobile={isMobile}
            text={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
            onClick={closeDrawer}
          >
            <DownloadButton id={item.id} name={item.name} />
          </IconButtonWithText>
          {canEdit && (
            <IconButtonWithText
              isMobile={isMobile}
              text={translateBuilder(BUILDER.SETTINGS_TITLE)}
              onClick={closeDrawer}
            >
              <ItemSettingsButton id={item.id} />
            </IconButtonWithText>
          )}
        </>
      );
    }
    return null;
  };

  if (isMobile) {
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
