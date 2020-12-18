import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
import NewItemModal from './NewItemModal';
import { CREATE_ITEM_BUTTON_ID } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  createNewButton: {
    cursor: 'pointer',
    margin: theme.spacing(1),
  },
}));

const NewItemButton = ({ fontSize }) => {
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
    <>
      <Tooltip placement="left" title={t('Create new item')} arrow>
        <AddCircleIcon
          id={CREATE_ITEM_BUTTON_ID}
          color="primary"
          fontSize={fontSize}
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
    </>
  );
};

NewItemButton.propTypes = {
  fontSize: PropTypes.string,
};

NewItemButton.defaultProps = {
  fontSize: 'large',
};

export default NewItemButton;
