import { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  IconButton,
  Stack,
  SwipeableDrawer,
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

const ButtonWithText = ({
  children,
  isMobile,
  text,
  onClick,
}: ButtonWithTextProps): JSX.Element =>
  isMobile ? (
    <StyledBox
      onClick={onClick}
      p={text ? '6px 11px ' : 0}
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

      const activeActions = (
        <>
          {showEditButton && (
            <ButtonWithText
              isMobile={isMobile}
              text={translateBuilder(BUILDER.EDIT_ITEM_BUTTON)}
              onClick={closeDrawer}
            >
              <EditButton item={item} />
            </ButtonWithText>
          )}
          {/* prevent moving from top header to avoid confusion */}

          <ButtonWithText isMobile={isMobile} text="" onClick={closeDrawer}>
            <Box>
              <ItemMenu
                item={item}
                canMove={false}
                canEdit={showEditButton}
                displayMenu={!isMobile}
              />
            </Box>
          </ButtonWithText>
          <ButtonWithText
            isMobile={isMobile}
            text={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
            onClick={closeDrawer}
          >
            <ShareButton itemId={item.id} />
          </ButtonWithText>
          <ButtonWithText
            isMobile={isMobile}
            text={translateBuilder(BUILDER.SETTINGS_SHOW_CHAT_LABEL)}
            onClick={closeDrawer}
          >
            <ChatboxButton
              tooltip={translateBuilder(BUILDER.ITEM_CHATBOX_TITLE)}
              id={ITEM_CHATBOX_BUTTON_ID}
              onClick={onClickChatbox}
            />
          </ButtonWithText>
          {canAdmin && (
            <ButtonWithText
              isMobile={isMobile}
              text={translateBuilder(BUILDER.LIBRARY_SETTINGS_BUTTON_TITLE)}
              onClick={closeDrawer}
            >
              <PublishButton itemId={item.id} />
            </ButtonWithText>
          )}
        </>
      );

      return (
        <>
          {openedActionTabId !== ItemActionTabs.Settings && activeActions}
          <ButtonWithText
            isMobile={isMobile}
            text={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
            onClick={closeDrawer}
          >
            <DownloadButton id={item.id} name={item.name} />
          </ButtonWithText>
          {canEdit && (
            <ButtonWithText
              isMobile={isMobile}
              text={translateBuilder(BUILDER.SETTINGS_TITLE)}
              onClick={closeDrawer}
            >
              <ItemSettingsButton id={item.id} />
            </ButtonWithText>
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
          <IconButton onClick={toggleActionsDrawer}>
            <SettingsIcon />
          </IconButton>
        </Box>

        <SwipeableDrawer
          anchor="bottom"
          open={isItemActionsDrawerOpen}
          onClose={closeDrawer}
          onOpen={() => setIsItemActionsDrawerOpen(true)}
          PaperProps={{ sx: { maxHeight: '50vh', paddingY: 2 } }}
        >
          <Box display="flex" flexDirection="column">
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
