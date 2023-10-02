import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle, IconButton, Snackbar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { ItemMembership, PermissionLevel } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';
import { Button } from '@graasp/ui';

import { useCurrentUserContext } from '@/components/context/CurrentUserContext';

import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import { CONFIRM_MEMBERSHIP_DELETE_BUTTON_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import CancelButton from '../../common/CancelButton';

const labelId = 'alert-dialog-title';
const descriptionId = 'alert-dialog-description';

type Props = {
  open?: boolean;
  handleClose: () => void;
  item: ItemRecord;
  membershipToDelete: ItemMembership | null;
  hasOnlyOneAdmin: boolean;
};

const DeleteItemDialog = ({
  item,
  open = false,
  handleClose,
  membershipToDelete,
  hasOnlyOneAdmin = false,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: member } = useCurrentUserContext();

  const { mutate: deleteItemMembership } = mutations.useDeleteItemMembership();

  const onDelete = () => {
    if (membershipToDelete?.id) {
      deleteItemMembership({ id: membershipToDelete.id, itemId: item.id });
      handleClose();
    }
  };

  let dialogText = '';
  const isDeletingLastAdmin =
    hasOnlyOneAdmin && membershipToDelete?.permission === PermissionLevel.Admin;
  // incase of deleting the only admin
  if (isDeletingLastAdmin) {
    dialogText = translateBuilder(BUILDER.DELETE_LAST_ADMIN_ALERT_MESSAGE);
  } else if (member?.id === membershipToDelete?.member?.id) {
    // deleting yourself
    dialogText = translateBuilder(BUILDER.DELETE_OWN_MEMBERSHIP_MESSAGE);
  } else {
    // delete other members
    dialogText = translateBuilder(BUILDER.DELETE_MEMBERSHIP_MESSAGE, {
      name: membershipToDelete?.member.name,
      permissionLevel: membershipToDelete?.permission,
    });
  }
  return isDeletingLastAdmin ? (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>Error</AlertTitle>
        {dialogText}
      </Alert>
    </Snackbar>
  ) : (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={labelId}>
        {translateBuilder(BUILDER.DELETE_MEMBERSHIP)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>{dialogText}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <CancelButton onClick={handleClose} />
        <Button
          id={CONFIRM_MEMBERSHIP_DELETE_BUTTON_ID}
          onClick={onDelete}
          color="error"
          autoFocus
          variant="text"
        >
          {translateBuilder(BUILDER.DELETE_MEMBERSHIP_MODAL_CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteItemDialog;
