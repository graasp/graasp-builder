import { useState } from 'react';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Grid, TextField, TextFieldProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import {
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
        ({ member: { email: thisEmail } }) => thisEmail === email,
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
      const result = await shareItem({
        itemId,
        data: [
          {
            id: itemId,
            email: invitation.email,
            permission: invitation.permission,
          },
        ],
      });

      // manually notify error
      if (result?.errors?.length) {
        console.error(result?.errors);
      } else {
        // reset email input
        setInvitation({
          ...invitation,
          email: '',
        });
      }
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

  const renderInvitationStatus = () => (
    <Tooltip
      title={translateBuilder(BUILDER.SHARE_ITEM_FORM_INVITATION_TOOLTIP)}
    >
      <span>
        <IconButton aria-label="status">
          <ErrorOutlineIcon />
        </IconButton>
      </span>
    </Tooltip>
  );

  const renderButton = () => {
    const disabled = Boolean(error);
    return (
      <Button
        onClick={handleShare}
        disabled={disabled}
        id={SHARE_ITEM_SHARE_BUTTON_ID}
      >
        {translateBuilder(BUILDER.SHARE_ITEM_FORM_CONFIRM_BUTTON)}
      </Button>
    );
  };

  return (
    <Grid container id={CREATE_MEMBERSHIP_FORM_ID}>
      <Grid container alignItems="center" justifyContent="center" spacing={1}>
        <Grid item xs={5}>
          <TextField
            value={invitation.email}
            sx={{
              width: '100%',
              marginTop: 1,
            }}
            id={SHARE_ITEM_EMAIL_INPUT_ID}
            variant="outlined"
            label={translateBuilder(BUILDER.SHARE_ITEM_FORM_EMAIL_LABEL)}
            error={Boolean(error)}
            helperText={error}
            onChange={onChangeEmail}
          />
        </Grid>
        <Grid item>
          <ItemMembershipSelect
            value={invitation.permission}
            onChange={onChangePermission}
          />
        </Grid>
        <Grid item>{renderButton()}</Grid>
        <Grid item>{renderInvitationStatus()}</Grid>
      </Grid>
    </Grid>
  );
};

export default CreateItemMembershipForm;
