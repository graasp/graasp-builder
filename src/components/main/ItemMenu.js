import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
} from '../../config/selectors';
import { CopyItemModalContext } from '../context/CopyItemModalContext';
import { MoveItemModalContext } from '../context/MoveItemModalContext';

const ItemMenu = ({ itemId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const { openModal: openCopyModal } = useContext(CopyItemModalContext);
  const { openModal: openMoveModal } = useContext(MoveItemModalContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMove = () => {
    openMoveModal(itemId);
    handleClose();
  };

  const handleCopy = () => {
    openCopyModal(itemId);
    handleClose();
  };

  return (
    <>
      <IconButton className={ITEM_MENU_BUTTON_CLASS} onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={buildItemMenu(itemId)}
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
      </Menu>
    </>
  );
};

ItemMenu.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default ItemMenu;
