import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  setMoveModalSettings,
  setCopyModalSettings,
  setEditModalSettings,
  setShareModalSettings,
} from '../../actions/layout';
import {
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
  ITEM_MENU_EDIT_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MENU_SHARE_BUTTON_CLASS,
} from '../../config/selectors';
import { editItem } from '../../actions/item';

const ItemMenu = ({
  item,
  dispatchSetMoveModalSettings,
  dispatchSetCopyModalSettings,
  dispatchSetEditModalSettings,
  dispatchSetShareModalSettings,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMove = () => {
    dispatchSetMoveModalSettings({ open: true, itemId: item.id });
    handleClose();
  };

  const handleCopy = () => {
    dispatchSetCopyModalSettings({ open: true, itemId: item.id });
    handleClose();
  };

  const handleEdit = () => {
    dispatchSetEditModalSettings({ open: true, itemId: item.id });
    handleClose();
  };

  const handleShare = () => {
    dispatchSetShareModalSettings({ open: true, itemId: item.id });
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
        <MenuItem onClick={handleEdit} className={ITEM_MENU_EDIT_BUTTON_CLASS}>
          {t('Edit')}
        </MenuItem>
        <MenuItem onClick={handleMove} className={ITEM_MENU_MOVE_BUTTON_CLASS}>
          {t('Move')}
        </MenuItem>
        <MenuItem onClick={handleCopy} className={ITEM_MENU_COPY_BUTTON_CLASS}>
          {t('Copy')}
        </MenuItem>
        <MenuItem
          onClick={handleShare}
          className={ITEM_MENU_SHARE_BUTTON_CLASS}
        >
          {t('Share')}
        </MenuItem>
      </Menu>
    </>
  );
};

ItemMenu.propTypes = {
  dispatchSetEditModalSettings: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  dispatchSetMoveModalSettings: PropTypes.func.isRequired,
  dispatchSetCopyModalSettings: PropTypes.func.isRequired,
  dispatchSetShareModalSettings: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  dispatchSetMoveModalSettings: setMoveModalSettings,
  dispatchSetCopyModalSettings: setCopyModalSettings,
  dispatchSetEditModalSettings: setEditModalSettings,
  dispatchSetShareModalSettings: setShareModalSettings,
  dispatchEditItem: editItem,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(ItemMenu);

export default ConnectedComponent;
