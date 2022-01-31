import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import { MUTATION_KEYS } from '@graasp/query-client';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  buildItemMenu,
  buildItemMenuButtonId,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
  ITEM_MENU_FLAG_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MENU_RECYCLE_BUTTON_CLASS,
  ITEM_MENU_SHORTCUT_BUTTON_CLASS,
} from '../../config/selectors';
import { CopyItemModalContext } from '../context/CopyItemModalContext';
import { CreateShortcutModalContext } from '../context/CreateShortcutModalContext';
import { MoveItemModalContext } from '../context/MoveItemModalContext';
import { FlagItemModalContext } from '../context/FlagItemModalContext';
import { useMutation } from '../../config/queryClient';

const ItemMenu = ({ item, canEdit }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const { mutate: recycleItem } = useMutation(MUTATION_KEYS.RECYCLE_ITEM);
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
    openCopyModal([item.id]);
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

  const handleRecycle = () => {
    recycleItem(item.id);
    handleClose();
  };

  const renderEditorActions = () => {
    if (!canEdit) {
      return null;
    }
    return [
      <MenuItem
        key="move"
        onClick={handleMove}
        className={ITEM_MENU_MOVE_BUTTON_CLASS}
      >
        {t('Move')}
      </MenuItem>,
      <MenuItem
        key="copy"
        onClick={handleCopy}
        className={ITEM_MENU_COPY_BUTTON_CLASS}
      >
        {t('Copy')}
      </MenuItem>,
      <MenuItem
        key="delete"
        onClick={handleRecycle}
        className={ITEM_MENU_RECYCLE_BUTTON_CLASS}
      >
        {t('Delete')}
      </MenuItem>,
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
      <Menu
        id={buildItemMenu(item.id)}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {renderEditorActions()}
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
  canEdit: PropTypes.bool,
};

ItemMenu.defaultProps = {
  canEdit: false,
};

export default ItemMenu;
