import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { makeStyles } from '@material-ui/core/styles';
import {
  DELETE_ITEM_MUTATION_KEY,
  DELETE_ITEMS_MUTATION_KEY,
} from '../../config/keys';

const useStyles = makeStyles(() => ({
  deleteButton: {
    color: 'red',
  },
}));

const DeleteItemDialog = ({ itemIds, open, handleClose }) => {
  const { t } = useTranslation();

  const { mutate: deleteItems } = useMutation(DELETE_ITEMS_MUTATION_KEY);
  const { mutate: deleteItem } = useMutation(DELETE_ITEM_MUTATION_KEY);

  const classes = useStyles();

  const onDelete = () => {
    if (itemIds.length > 1) {
      deleteItems(itemIds);
    } else {
      deleteItem(itemIds);
    }
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('Confirm deleting item.')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('This item will be deleted permanently.')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('Cancel')}
        </Button>
        <Button
          className={classes.deleteButton}
          onClick={onDelete}
          color="secondary"
          autoFocus
        >
          {t('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteItemDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

DeleteItemDialog.defaultProps = {
  open: false,
};

export default DeleteItemDialog;
