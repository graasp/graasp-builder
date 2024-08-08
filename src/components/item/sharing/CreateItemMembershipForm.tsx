import { useState } from 'react';

import { ErrorOutline } from '@mui/icons-material';
import {
  IconButton,
  Stack,
  TextField,
  TextFieldProps,
  Tooltip,
} from '@mui/material';

import {
  AccountType,
  DiscriminatedItem,
  Invitation,
  ItemMembership,
  PermissionLevel,
} from '@graasp/sdk';
import { Button } from '@graasp/ui';

import validator from 'validator';

import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import {
  CREATE_MEMBERSHIP_FORM_ID,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import ItemMembershipSelect, {
  ItemMembershipSelectProps,
} from './ItemMembershipSelect';

type InvitationFieldInfoType = Pick<Invitation, 'email' | 'permission'>;
type Props = {
  item: DiscriminatedItem;
  memberships: ItemMembership[];
};

// todo: handle multiple invitations
const CreateItemMembershipForm = ({
  item,
  memberships,
}: Props): JSX.Element => {
  const itemId = item.id;
  const [error, setError] = useState<string | null>();

  const { mutateAsync: shareItem } = mutations.useShareItem();

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
      memberships.find(
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
      />
      <Button
        onClick={handleShare}
        disabled={Boolean(error)}
        id={SHARE_ITEM_SHARE_BUTTON_ID}
      >
        {translateBuilder(BUILDER.SHARE_ITEM_FORM_CONFIRM_BUTTON)}
      </Button>
      <Tooltip
        title={translateBuilder(BUILDER.SHARE_ITEM_FORM_INVITATION_TOOLTIP)}
      >
        <IconButton aria-label="status">
          <ErrorOutline />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default CreateItemMembershipForm;
