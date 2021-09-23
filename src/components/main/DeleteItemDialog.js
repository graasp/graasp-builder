import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../config/queryClient';
import {
  CONFIRM_DELETE_BUTTON_ID,
  CONFIRM_RECYCLE_BUTTON_ID,
} from '../../config/selectors';

const useStyles = makeStyles(() => ({
  confirmDeleteButton: {
    color: 'red',
  },
}));

const {
  DELETE_ITEMS,
  DELETE_ITEM,
  RECYCLE_ITEMS,
  RECYCLE_ITEM,
} = MUTATION_KEYS;

const DeleteItemDialog = ({ itemIds, open, handleClose }) => {
  const { t } = useTranslation();

  const { mutate: deleteItems } = useMutation(DELETE_ITEMS);
  const { mutate: deleteItem } = useMutation(DELETE_ITEM);
  const { mutate: recycleItems } = useMutation(RECYCLE_ITEMS);
  const { mutate: recycleItem } = useMutation(RECYCLE_ITEM);

  const classes = useStyles();

  const onDelete = () => {
    if (itemIds.length > 1) {
      deleteItems(itemIds);
    } else {
      deleteItem(itemIds);
    }
    handleClose();
  };
  const onRecycle = () => {
    if (itemIds.length > 1) {
      recycleItems(itemIds);
    } else {
      recycleItem(itemIds);
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
          {t('Choose one of the following action.')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('Cancel')}
        </Button>
        <Button
          id={CONFIRM_DELETE_BUTTON_ID}
          className={classes.confirmDeleteButton}
          onClick={onDelete}
          color="secondary"
          autoFocus
        >
          {t('Delete Permanently')}
        </Button>
        <Button
          id={CONFIRM_RECYCLE_BUTTON_ID}
          onClick={onRecycle}
          color="primary"
          autoFocus
          variant="contained"
        >
          {t('Recycle')}
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
