import { Dispatch, SetStateAction } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import CancelButton from '@/components/common/CancelButton';
import { useBuilderTranslation } from '@/config/i18n';
import {
  buildShortLinkCancelBtnId,
  buildShortLinkConfirmDeleteBtnId,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

interface DeleteLinkProps {
  shortLink: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: () => void;
}

const ConfirmDeleteLink = ({
  shortLink,
  open,
  setOpen,
  handleDelete,
}: DeleteLinkProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleClose = () => setOpen(false);

  const onClose = (_event: Event, reason: string) => {
    if (reason === 'backdropClick') {
      return;
    }

    handleClose();
  };

  const handleClickDelete = () => {
    setOpen(false);
    handleDelete();
  };

  const CONFIRM_DELETE_DIALOG_TITLE = `alert-dialog-title-delete-${shortLink}`;
  const CONFIRM_DELETE_DIALOG_DESC = `alert-dialog-desc-delete-${shortLink}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={CONFIRM_DELETE_DIALOG_TITLE}
      aria-describedby={CONFIRM_DELETE_DIALOG_DESC}
    >
      <DialogTitle id={CONFIRM_DELETE_DIALOG_TITLE}>
        {translateBuilder(BUILDER.CONFIRM_DELETE_SHORT_LINK_TITLE)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={CONFIRM_DELETE_DIALOG_DESC}>
          {translateBuilder(BUILDER.CONFIRM_DELETE_SHORT_LINK_MSG, {
            shortLink,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CancelButton
          onClick={handleClose}
          id={buildShortLinkCancelBtnId(shortLink)}
        />
        <Button
          onClick={handleClickDelete}
          color="error"
          id={buildShortLinkConfirmDeleteBtnId(shortLink)}
        >
          {translateBuilder(BUILDER.DELETE_BTN)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteLink;
