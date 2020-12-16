import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoveItemModal from './MoveItemModal';

const ItemMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMove = () => {
    setIsMoveModalOpen(true);
    handleClose();
  };

  const onModalClose = () => {
    setIsMoveModalOpen(false);
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
        <MenuItem onClick={handleMove}>Move</MenuItem>
        <MenuItem onClick={handleClose}>Some action...</MenuItem>
      </Menu>
      <MoveItemModal onClose={onModalClose} open={isMoveModalOpen} />
    </>
  );
};

export default ItemMenu;
