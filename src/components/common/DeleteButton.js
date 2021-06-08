import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { ITEM_DELETE_BUTTON_CLASS } from '../../config/selectors';
import DeleteItemDialog from '../main/DeleteItemDialog';

const DeleteButton = ({ itemIds, color, id }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t('Delete')}>
        <IconButton
          id={id}
          color={color}
          className={ITEM_DELETE_BUTTON_CLASS}
          aria-label="delete"
          onClick={handleClickOpen}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <DeleteItemDialog
        open={open}
        handleClose={handleClose}
        itemIds={itemIds}
      />
    </>
  );
};

DeleteButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
};

DeleteButton.defaultProps = {
  color: 'default',
  id: '',
};

export default DeleteButton;
