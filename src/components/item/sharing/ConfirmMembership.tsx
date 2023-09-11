import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { PermissionLevel } from '@graasp/sdk';
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
  item: any;
  memberToDelete: any;
  isOneAdmin: boolean;
};

const DeleteItemDialog = ({
  item,
  open = false,
  handleClose,
  memberToDelete,
  isOneAdmin = false,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: member } = useCurrentUserContext();

  const { mutate: deleteItemMembership } = mutations.useDeleteItemMembership();

  const onDelete = () => {
    deleteItemMembership({ id: memberToDelete.instanceId, itemId: item.id });
    handleClose();
  };

  let dialogText = '';
  // incase of deleting the only admin
  if (isOneAdmin && memberToDelete?.permission === PermissionLevel?.Admin) {
    dialogText = translateBuilder(BUILDER?.DELETE_ONLY_ADMIN_ALERT_MESSAGE);
  } else if (member?.id === memberToDelete?.memberInstance) {
    // deleting yourself
    dialogText = translateBuilder(BUILDER.DELETE_OWN_MEMBERSHIP_MESSAGE);
  } else {
    // delete other members
    dialogText = translateBuilder(BUILDER.DELETE_MEMBERSHIP_MESSAGE);
  }
  return (
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
      {isOneAdmin && memberToDelete?.permission === PermissionLevel?.Admin ? (
        <Button onClick={handleClose} autoFocus variant="text">
          ok
        </Button>
      ) : (
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
      )}
    </Dialog>
  );
};

export default DeleteItemDialog;
