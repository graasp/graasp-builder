import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { FC } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { CONFIRM_DELETE_BUTTON_ID } from '../../config/selectors';
import CancelButton from '../common/CancelButton';

const labelId = 'alert-dialog-title';
const descriptionId = 'alert-dialog-description';

const { DELETE_ITEMS, DELETE_ITEM } = MUTATION_KEYS;

type Props = {
  open?: boolean;
  handleClose: () => void;
  itemIds: string[];
};

const DeleteItemDialog: FC<Props> = ({
  itemIds,
  open = false,
  handleClose,
}) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: deleteItems } = useMutation<unknown, unknown, string[]>(
    DELETE_ITEMS,
  );
  const { mutate: deleteItem } = useMutation<unknown, unknown, string>(
    DELETE_ITEM,
  );

  const onDelete = () => {
    if (itemIds.length > 1) {
      deleteItems(itemIds);
    } else {
      // we still use this call because it has feedback
      // remove when deleteItems will have feedback
      deleteItem(itemIds as unknown as string);
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
        {translateBuilder(BUILDER.DELETE_ITEM_MODAL_TITLE)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>
          {translateBuilder(BUILDER.DELETE_ITEM_MODAL_CONTENT, {
            count: itemIds.length,
          })}
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
