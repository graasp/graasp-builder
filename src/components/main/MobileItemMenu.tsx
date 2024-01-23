import { useContext } from 'react';

import FlagIcon from '@mui/icons-material/Flag';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { Divider } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';

import { DiscriminatedItem } from '@graasp/sdk';
import { ActionButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import CollapseButton from '../common/CollapseButton';
import FavoriteButton from '../common/FavoriteButton';
import HideButton from '../common/HideButton';
import IconButtonWithText from '../common/IconButtonWithText';
import MoveButton from '../common/MoveButton';
import PinButton from '../common/PinButton';
import PublishButton from '../common/PublishButton';
import RecycleButton from '../common/RecycleButton';
import ShareButton from '../common/ShareButton';
import { CreateShortcutModalContext } from '../context/CreateShortcutModalContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { FlagItemModalContext } from '../context/FlagItemModalContext';
import CopyButton from './CopyButton';

type Props = {
  item: DiscriminatedItem;
  canEdit?: boolean;
  canMove?: boolean;
  closeDrawer: () => void;
  canAdmin: boolean;
};

const MobileItemMenu = ({
  item,
  canEdit = false,
  canMove = false,
  closeDrawer,
  canAdmin,
}: Props): JSX.Element => {
  const { data: member } = useCurrentUserContext();
  const { t: translateBuilder } = useBuilderTranslation();
  const { openModal: openCreateShortcutModal } = useContext(
    CreateShortcutModalContext,
  );
  const { openModal: openFlagModal } = useContext(FlagItemModalContext);

  const handleCreateShortcut = () => {
    openCreateShortcutModal(item);
    closeDrawer();
  };

  const handleFlag = () => {
    openFlagModal?.(item.id);
    closeDrawer();
  };

  const renderEditorActions = () => {
    if (!canEdit) {
      return null;
    }
    const result = canMove
      ? [
          <MoveButton
            key="move"
            type={ActionButton.MENU_ITEM}
            itemIds={[item.id]}
          />,
        ]
      : [];
    return result.concat([
      <HideButton
        key="hide"
        type={ActionButton.MENU_ITEM}
        item={item}
        onClick={closeDrawer}
      />,
      <CollapseButton
        key="collapse"
        type={ActionButton.MENU_ITEM}
        item={item}
        onClick={closeDrawer}
      />,
      <PinButton
        key="pin"
        type={ActionButton.MENU_ITEM}
        item={item}
        onClick={closeDrawer}
      />,
    ]);
  };

  const renderAuthenticatedActions = () => {
    if (!member || !member.id) {
      return null;
    }
    return [
      <CopyButton
        key="copy"
        type={ActionButton.MENU_ITEM}
        itemIds={[item.id]}
        onClick={closeDrawer}
      />,
      <FavoriteButton
        size="medium"
        key="favorite"
        type={ActionButton.MENU_ITEM}
        item={item}
        onClick={closeDrawer}
      />,
    ];
  };
  const shareActions = (
    <>
      <IconButtonWithText
        text={translateBuilder(BUILDER.SHARE_ITEM_BUTTON)}
        onClick={closeDrawer}
      >
        <ShareButton itemId={item.id} />
      </IconButtonWithText>
      {canAdmin && (
        <IconButtonWithText
          text={translateBuilder(BUILDER.LIBRARY_SETTINGS_BUTTON_TITLE)}
          onClick={closeDrawer}
        >
          <PublishButton itemId={item.id} />
        </IconButtonWithText>
      )}
    </>
  );
  return (
    <>
      {renderAuthenticatedActions()}
      <Divider />
      {shareActions}
      <Divider />
      <MenuItem
        onClick={handleCreateShortcut}
        className={ITEM_MENU_SHORTCUT_BUTTON_CLASS}
      >
        <ListItemIcon>
          <LabelImportantIcon />
        </ListItemIcon>
        {translateBuilder(BUILDER.ITEM_MENU_CREATE_SHORTCUT_MENU_ITEM)}
      </MenuItem>
      {renderEditorActions()}
      <Divider />
      {canEdit && (
        <RecycleButton
          key="recycle"
          type={ActionButton.MENU_ITEM}
          itemIds={[item.id]}
        />
      )}
      <MenuItem onClick={handleFlag} className={ITEM_MENU_FLAG_BUTTON_CLASS}>
        <ListItemIcon>
          <FlagIcon />
        </ListItemIcon>
        {translateBuilder(BUILDER.ITEM_MENU_FLAG_MENU_ITEM)}
      </MenuItem>
    </>
  );
};

export default MobileItemMenu;
