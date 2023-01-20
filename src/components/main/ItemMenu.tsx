import { RecordOf } from 'immutable';

import FlagIcon from '@mui/icons-material/Flag';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { FC, useContext, useState } from 'react';

import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { BUTTON_TYPES } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
  buildItemMenu,
  buildItemMenuButtonId,
} from '../../config/selectors';
import CollapseButton from '../common/CollapseButton';
import FavoriteButton from '../common/FavoriteButton';
import HideButton from '../common/HideButton';
import MoveButton from '../common/MoveButton';
import PinButton from '../common/PinButton';
import RecycleButton from '../common/RecycleButton';
import { CreateShortcutModalContext } from '../context/CreateShortcutModalContext';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { FlagItemModalContext } from '../context/FlagItemModalContext';
import CopyButton from './CopyButton';

type Props = {
  item: RecordOf<Item>;
  canEdit?: boolean;
};

const ItemMenu: FC<Props> = ({ item, canEdit = false }) => {
  const { data: member } = useContext(CurrentUserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const { t: translateBuilder } = useBuilderTranslation();
  const { openModal: openCreateShortcutModal } = useContext(
    CreateShortcutModalContext,
  );
  const { openModal: openFlagModal } = useContext(FlagItemModalContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateShortcut = () => {
    openCreateShortcutModal(item);
    handleClose();
  };

  const handleFlag = () => {
    openFlagModal(item.id);
    handleClose();
  };

  const renderEditorActions = () => {
    if (!canEdit) {
      return null;
    }
    return [
      <MoveButton
        key="move"
        type={BUTTON_TYPES.MENU_ITEM}
        itemIds={[item.id]}
        onClick={handleClose}
      />,
      <HideButton key="hide" type={BUTTON_TYPES.MENU_ITEM} item={item} />,
      <PinButton key="pin" type={BUTTON_TYPES.MENU_ITEM} item={item} />,
      <CollapseButton
        key="collapse"
        type={BUTTON_TYPES.MENU_ITEM}
        item={item}
      />,
      <RecycleButton
        key="recycle"
        type={BUTTON_TYPES.MENU_ITEM}
        itemIds={[item.id]}
        onClick={handleClose}
      />,
    ];
  };

  const renderAuthenticatedActions = () => {
    if (!member || !member.id) {
      return null;
    }
    return [
      <FavoriteButton
        key="favorite"
        type={BUTTON_TYPES.MENU_ITEM}
        item={item}
      />,
      <CopyButton
        key="copy"
        type={BUTTON_TYPES.MENU_ITEM}
        itemIds={[item.id]}
        onClick={handleClose}
      />,
    ];
  };

  return (
    <>
      <IconButton
        id={buildItemMenuButtonId(item.id)}
        className={ITEM_MENU_BUTTON_CLASS}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      {Boolean(anchorEl) && (
        <Menu
          id={buildItemMenu(item.id)}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {renderAuthenticatedActions()}
          {renderEditorActions()}
          <MenuItem
            onClick={handleCreateShortcut}
            className={ITEM_MENU_SHORTCUT_BUTTON_CLASS}
          >
            <ListItemIcon>
              <LabelImportantIcon />
            </ListItemIcon>
            {translateBuilder(BUILDER.ITEM_MENU_CREATE_SHORTCUT_MENU_ITEM)}
          </MenuItem>
          <MenuItem
            onClick={handleFlag}
            className={ITEM_MENU_FLAG_BUTTON_CLASS}
          >
            <ListItemIcon>
              <FlagIcon />
            </ListItemIcon>
            {translateBuilder(BUILDER.ITEM_MENU_FLAG_MENU_ITEM)}
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default ItemMenu;
