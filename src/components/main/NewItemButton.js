import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
import NewItemModal from './NewItemModal';
import { CREATE_ITEM_BUTTON_ID } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  createNewButton: {
    cursor: 'pointer',
  },
}));

const NewItemButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Tooltip placement="left" title={t('Create new item')} arrow>
        <AddCircleIcon
          id={CREATE_ITEM_BUTTON_ID}
          color="primary"
          fontSize="large"
          className={classes.createNewButton}
          onClick={handleClickOpen}
        />
      </Tooltip>
      <NewItemModal
        open={open}
        setOpen={setOpen}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default NewItemButton;
