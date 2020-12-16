import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
import NewItemModal from './NewItemModal';

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
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Tooltip placement="left" title="Create new item" arrow>
        <AddCircleIcon
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
