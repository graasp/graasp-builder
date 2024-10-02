import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { CONFIRM_DELETE_BUTTON_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import CancelButton from '../common/CancelButton';

const labelId = 'alert-dialog-title';
const descriptionId = 'alert-dialog-description';

type Props = {
  open?: boolean;
  handleClose: () => void;
  items: DiscriminatedItem[];
  onConfirm?: () => void;
};

const DeleteItemDialog = ({
  items,
  open = false,
  handleClose,
  onConfirm,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: deleteItems } = mutations.useDeleteItems();

  const itemIds = items.map(({ id }) => id);

  const onDelete = () => {
    deleteItems(itemIds);
    onConfirm?.();
    handleClose();
  };

  const names = items
    .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
    .map(({ name }) => <li>{name}</li>);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={labelId}>
        {translateBuilder(BUILDER.DELETE_ITEM_MODAL_TITLE)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>
          {translateBuilder(BUILDER.DELETE_ITEM_MODAL_CONTENT, {
            count: itemIds.length,
          })}
          <ul>{names}</ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} />
        <Button
          id={CONFIRM_DELETE_BUTTON_ID}
          onClick={onDelete}
          color="error"
          autoFocus
          variant="text"
        >
          {translateBuilder(BUILDER.DELETE_ITEM_MODAL_CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteItemDialog;
