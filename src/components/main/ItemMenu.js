import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
} from '../../config/selectors';
import { CopyItemModalContext } from '../context/CopyItemModalContext';
import { CreateShortcutModalContext } from '../context/CreateShortcutModalContext';
import { MoveItemModalContext } from '../context/MoveItemModalContext';
import { FlagItemModalContext } from '../context/FlagItemModalContext';

const ItemMenu = ({ item }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const { openModal: openCopyModal } = useContext(CopyItemModalContext);
  const { openModal: openMoveModal } = useContext(MoveItemModalContext);
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

  const handleMove = () => {
    openMoveModal([item.id]);
    handleClose();
  };

  const handleCopy = () => {
    openCopyModal(item.id);
    handleClose();
  };

  const handleCreateShortcut = () => {
    openCreateShortcutModal(item);
    handleClose();
  };

  const handleFlag = () => {
    openFlagModal(item.id);
    handleClose();
  };

  return (
    <>
      <IconButton className={ITEM_MENU_BUTTON_CLASS} onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={buildItemMenu(item.id)}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleMove} className={ITEM_MENU_MOVE_BUTTON_CLASS}>
          {t('Move')}
        </MenuItem>
        <MenuItem onClick={handleCopy} className={ITEM_MENU_COPY_BUTTON_CLASS}>
          {t('Copy')}
        </MenuItem>
        <MenuItem
          onClick={handleCreateShortcut}
          className={ITEM_MENU_SHORTCUT_BUTTON_CLASS}
        >
          {t('Create Shortcut')}
        </MenuItem>
        <MenuItem onClick={handleFlag} className={ITEM_MENU_FLAG_BUTTON_CLASS}>
          {t('Flag')}
        </MenuItem>
      </Menu>
    </>
  );
};

ItemMenu.propTypes = {
  item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
};

export default ItemMenu;
