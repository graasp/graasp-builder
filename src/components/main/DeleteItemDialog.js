import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER, COMMON, namespaces } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { CONFIRM_DELETE_BUTTON_ID } from '../../config/selectors';

const labelId = 'alert-dialog-title';
const descriptionId = 'alert-dialog-description';

const { DELETE_ITEMS, DELETE_ITEM } = MUTATION_KEYS;

const DeleteItemDialog = ({ itemIds, open, handleClose }) => {
  const { t } = useBuilderTranslation();
  const { t: commonT } = useTranslation(namespaces.common);

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
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={labelId}>
        {t(BUILDER.DELETE_ITEM_MODAL_TITLE)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>
          {t(BUILDER.DELETE_ITEM_MODAL_CONTENT, { count: itemIds.length })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="text">
          {commonT(COMMON.CANCEL_BUTTON)}
        </Button>
        <Button
          id={CONFIRM_DELETE_BUTTON_ID}
          onClick={onDelete}
          color="error"
          autoFocus
          variant="text"
        >
          {t(BUILDER.DELETE_ITEM_MODAL_CONFIRM_BUTTON)}
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
