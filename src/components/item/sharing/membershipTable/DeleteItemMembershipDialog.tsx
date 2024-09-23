import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import {
  DiscriminatedItem,
  ItemMembership,
  PermissionLevel,
} from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '../../../../config/i18n';
import { hooks, mutations } from '../../../../config/queryClient';
import { CONFIRM_MEMBERSHIP_DELETE_BUTTON_ID } from '../../../../config/selectors';
import { BUILDER } from '../../../../langs/constants';
import CancelButton from '../../../common/CancelButton';

const labelId = 'alert-dialog-title';
const descriptionId = 'alert-dialog-description';

type Props = {
  open?: boolean;
  handleClose: () => void;
  itemId: DiscriminatedItem['id'];
  membershipToDelete: Pick<
    ItemMembership,
    'id' | 'account' | 'permission'
  > | null;
  hasOnlyOneAdmin?: boolean;
};

const DeleteItemMembershipDialog = ({
  itemId,
  open = false,
  handleClose,
  membershipToDelete,
  hasOnlyOneAdmin = false,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: member } = hooks.useCurrentMember();
  const { mutateAsync: deleteItemMembership } =
    mutations.useDeleteItemMembership();

  const navigate = useNavigate();

  const onDelete = () => {
    if (membershipToDelete?.id) {
      deleteItemMembership({
        id: membershipToDelete.id,
        itemId,
      }).then(() => {
        // if current user deleted their own membership navigate them to the home
        if (membershipToDelete.account.id === member?.id) {
          navigate('/');
        }
      });

      handleClose();
    }
  };

  let dialogText = '';
  const isDeletingLastAdmin =
    hasOnlyOneAdmin && membershipToDelete?.permission === PermissionLevel.Admin;
  // incase of deleting the only admin
  if (isDeletingLastAdmin) {
    dialogText = translateBuilder(BUILDER.DELETE_LAST_ADMIN_ALERT_MESSAGE);
  } else if (member?.id === membershipToDelete?.account?.id) {
    // deleting yourself
    dialogText = translateBuilder(BUILDER.DELETE_OWN_MEMBERSHIP_MESSAGE);
  } else {
    // delete other members
    dialogText = translateBuilder(BUILDER.DELETE_MEMBERSHIP_MESSAGE, {
      name: membershipToDelete?.account.name,
      permissionLevel: membershipToDelete?.permission,
    });
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
        {isDeletingLastAdmin ? (
          <Alert severity="error">{dialogText}</Alert>
        ) : (
          <DialogContentText id={descriptionId}>{dialogText}</DialogContentText>
        )}
      </DialogContent>

      <DialogActions>
        {isDeletingLastAdmin ? (
          <Button onClick={handleClose} autoFocus variant="text">
            {translateBuilder(BUILDER.APPROVE_BUTTON_TEXT)}
          </Button>
        ) : (
          <>
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
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteItemMembershipDialog;
