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
} from '../../actions/layout';

const ItemMenu = ({
  itemId,
  dispatchSetMoveModalSettings,
  dispatchSetCopyModalSettings,
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
    dispatchSetMoveModalSettings({ open: true, itemId });
    handleClose();
  };

  const handleCopy = () => {
    dispatchSetCopyModalSettings({ open: true, itemId });
    handleClose();
  };

  // todo: only display one modal for the whole page

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleMove}>{t('Move')}</MenuItem>
        <MenuItem onClick={handleCopy}>{t('Copy')}</MenuItem>
      </Menu>
    </>
  );
};

ItemMenu.propTypes = {
  itemId: PropTypes.string.isRequired,
  dispatchSetMoveModalSettings: PropTypes.func.isRequired,
  dispatchSetCopyModalSettings: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  dispatchSetMoveModalSettings: setMoveModalSettings,
  dispatchSetCopyModalSettings: setCopyModalSettings,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(ItemMenu);

export default ConnectedComponent;
