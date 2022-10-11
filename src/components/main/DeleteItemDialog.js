import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Button } from '@graasp/ui';

import { useMutation } from '../../config/queryClient';
import { CONFIRM_DELETE_BUTTON_ID } from '../../config/selectors';

const { DELETE_ITEMS, DELETE_ITEM } = MUTATION_KEYS;

const DeleteItemDialog = ({ itemIds, open, handleClose }) => {
  const { t } = useTranslation();

  const { mutate: deleteItems } = useMutation(DELETE_ITEMS);
  const { mutate: deleteItem } = useMutation(DELETE_ITEM);

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
      <DialogTitle id="alert-dialog-title">{t('Confirm deletion')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('itemDeleteMessage', { count: itemIds.length })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="text">
          {t('Cancel')}
        </Button>
        <Button
          id={CONFIRM_DELETE_BUTTON_ID}
          onClick={onDelete}
          color="error"
          autoFocus
          variant="text"
        >
          {t('Delete Permanently')}
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
