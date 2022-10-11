import { List, Record } from 'immutable';
import PropTypes from 'prop-types';
import validator from 'validator';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Grid, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS, routines } from '@graasp/query-client';
import { Button } from '@graasp/ui';

import notifier from '../../../config/notifier';
import { useMutation } from '../../../config/queryClient';
import {
  CREATE_MEMBERSHIP_FORM_ID,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
} from '../../../config/selectors';
import { buildInvitation } from '../../../utils/invitation';
import ItemMembershipSelect from './ItemMembershipSelect';

const { shareItemRoutine } = routines;

// todo: handle multiple invitations
const CreateItemMembershipForm = ({ item, members }) => {
  const itemId = item.id;
  const [error, setError] = useState(false);

  const { mutateAsync: shareItem } = useMutation(MUTATION_KEYS.SHARE_ITEM);
  const { t } = useTranslation();

  // use an array to later allow sending multiple invitations
  const [invitation, setInvitation] = useState(buildInvitation());

  const isInvitationInvalid = ({ email }) => {
    // check mail validity
    if (!email) {
      return t('The mail cannot be empty');
    }
    if (!validator.isEmail(email)) {
      return t('This mail is not valid');
    }
    // check mail does not already exist
    if (members.find(({ email: thisEmail }) => thisEmail === email)) {
      return t('This user already has access to this item');
    }
    return false;
  };

  const onChangePermission = (e) => {
    setInvitation({ ...invitation, permission: e.target.value });
  };

  const handleShare = async () => {
    // not good to check email for multiple invitations at once
    const isInvalid = isInvitationInvalid(invitation);

    if (isInvalid) {
      return setError(isInvalid);
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
      if (result?.failure?.length) {
        notifier({
          type: shareItemRoutine.FAILURE,
          payload: {
            error: {
              response: { data: { message: result?.failure?.[0].message } },
            },
          },
        });
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

  const onChangeEmail = (event) => {
    const newInvitation = {
      ...invitation,
      email: event.target.value,
    };
    setInvitation(newInvitation);
    if (error) {
      const isInvalid = isInvitationInvalid(newInvitation);
      setError(isInvalid);
    }
  };

  const renderInvitationStatus = () => (
    <Tooltip
      title={t(
        'Non-registered users will receive a personal link to register on the platform.',
      )}
    >
      <IconButton aria-label="status">
        <ErrorOutlineIcon />
      </IconButton>
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
        {t('Share')}
      </Button>
    );
  };

  return (
    <Grid container spacing={1} id={CREATE_MEMBERSHIP_FORM_ID}>
      <Grid container alignItems="center" justify="center">
        <Grid item xs={5}>
          <TextField
            value={invitation.email}
            sx={{
              width: '100%',
              marginTop: 1,
            }}
            id={SHARE_ITEM_EMAIL_INPUT_ID}
            variant="outlined"
            label={t('Email')}
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

CreateItemMembershipForm.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
  members: PropTypes.instanceOf(List),
};
CreateItemMembershipForm.defaultProps = {
  members: List(),
};

export default CreateItemMembershipForm;
