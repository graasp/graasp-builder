import { useState } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';

import {
  AccountType,
  DiscriminatedItem,
  Invitation,
  PermissionLevel,
} from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import validator from 'validator';

import {
  useBuilderTranslation,
  useCommonTranslation,
} from '../../../../config/i18n';
import { hooks, mutations } from '../../../../config/queryClient';
import {
  CREATE_MEMBERSHIP_FORM_ID,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
} from '../../../../config/selectors';
import { BUILDER } from '../../../../langs/constants';
import ItemMembershipSelect, {
  ItemMembershipSelectProps,
} from '../ItemMembershipSelect';

type InvitationFieldInfoType = Pick<Invitation, 'email' | 'permission'>;
type Props = {
  item: DiscriminatedItem;
  open: boolean;
  handleClose: () => void;
};

const CreateItemMembershipForm = ({
  item,
  open,
  handleClose,
}: Props): JSX.Element => {
  const itemId = item.id;
  const [error, setError] = useState<string | null>();

  const { mutateAsync: shareItem } = mutations.useShareItem();
  const { data: memberships } = hooks.useItemMemberships(item.id);

  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  // use an array to later allow sending multiple invitations
  const [invitation, setInvitation] = useState<InvitationFieldInfoType>({
    email: '',
    permission: PermissionLevel.Read,
  });

  const checkForInvitationError = ({
    email,
  }: {
    email: string;
  }): string | null => {
    // check mail validity
    if (!email) {
      return translateBuilder(
        BUILDER.SHARE_ITEM_FORM_INVITATION_EMPTY_EMAIL_MESSAGE,
      );
    }
    if (!validator.isEmail(email)) {
      return translateBuilder(
        BUILDER.SHARE_ITEM_FORM_INVITATION_INVALID_EMAIL_MESSAGE,
      );
    }
    // check mail does not already exist
    if (
      memberships?.find(
        ({ account }) =>
          account.type === AccountType.Individual && account.email === email,
      )
    ) {
      return translateBuilder(
        BUILDER.SHARE_ITEM_FORM_INVITATION_EMAIL_EXISTS_MESSAGE,
      );
    }
    return null;
  };

  const onChangePermission: ItemMembershipSelectProps['onChange'] = (e) => {
    setInvitation({
      ...invitation,
      permission: e.target.value as PermissionLevel,
    });
  };

  const handleShare = async () => {
    // not good to check email for multiple invitations at once
    const invitationError = checkForInvitationError(invitation);

    if (invitationError) {
      return setError(invitationError);
    }

    let returnedValue;
    try {
      await shareItem({
        itemId,
        invitations: [
          {
            email: invitation.email,
            permission: invitation.permission,
          },
        ],
      });

      // reset email input
      setInvitation({
        ...invitation,
        email: '',
      });

      handleClose();
    } catch (e) {
      console.error(e);
    }
    return returnedValue;
  };

  const onChangeEmail: TextFieldProps['onChange'] = (event) => {
    const newInvitation = {
      ...invitation,
      email: event.target.value,
    };
    setInvitation(newInvitation);
    if (error) {
      const isInvalid = checkForInvitationError(newInvitation);
      setError(isInvalid);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Share item</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {translateBuilder(BUILDER.SHARE_ITEM_FORM_INVITATION_TOOLTIP)}
        </Typography>
        <Stack
          id={CREATE_MEMBERSHIP_FORM_ID}
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <TextField
            id={SHARE_ITEM_EMAIL_INPUT_ID}
            variant="outlined"
            label={translateBuilder(BUILDER.SHARE_ITEM_FORM_EMAIL_LABEL)}
            helperText={error}
            value={invitation.email}
            onChange={onChangeEmail}
            error={Boolean(error)}
            sx={{ flexGrow: 1 }}
          />
          <ItemMembershipSelect
            value={invitation.permission}
            onChange={onChangePermission}
            size="medium"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text">{translateCommon(COMMON.CANCEL_BUTTON)}</Button>
        <Button
          onClick={handleShare}
          disabled={Boolean(error)}
          id={SHARE_ITEM_SHARE_BUTTON_ID}
        >
          {translateBuilder(BUILDER.SHARE_ITEM_FORM_CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateItemMembershipForm;
