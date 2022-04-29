import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { ITEM_DELETE_BUTTON_CLASS } from '../../config/selectors';
import DeleteItemDialog from '../main/DeleteItemDialog';
import { BUTTON_TYPES } from '../../config/constants';

const DeleteButton = ({ itemIds, color, id, type, onClick }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    onClick?.();
  };

  const handleClose = () => {
    setOpen(false);
  };
  const dialog = (
    <DeleteItemDialog open={open} handleClose={handleClose} itemIds={itemIds} />
  );

  const text = t('Delete');

  switch (type) {
    case BUTTON_TYPES.MENU_ITEM:
      return (
        <>
          <MenuItem key={text} onClick={handleClickOpen}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            {text}
          </MenuItem>
          {dialog}
        </>
      );
    default:
    case BUTTON_TYPES.ICON_BUTTON:
      return (
        <>
          <Tooltip title={text}>
            <IconButton
              id={id}
              color={color}
              className={ITEM_DELETE_BUTTON_CLASS}
              aria-label={text}
              onClick={handleClickOpen}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {dialog}
        </>
      );
  }
};

DeleteButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

DeleteButton.defaultProps = {
  color: 'default',
  id: '',
  type: BUTTON_TYPES.ICON_BUTTON,
  onClick: null,
};

export default DeleteButton;
