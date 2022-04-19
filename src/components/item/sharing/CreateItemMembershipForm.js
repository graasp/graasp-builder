import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@graasp/ui';
import IconButton from '@material-ui/core/IconButton';
import { List } from 'immutable';
import Tooltip from '@material-ui/core/Tooltip';
import { v4 } from 'uuid';
import { Grid, makeStyles, TextField } from '@material-ui/core';
import { MUTATION_KEYS, Api } from '@graasp/query-client';
import { useTranslation } from 'react-i18next';
import validator from 'validator';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { useMutation } from '../../../config/queryClient';
import { API_HOST } from '../../../config/constants';
import { SHARE_ITEM_EMAIL_INPUT_ID } from '../../../config/selectors';
import { PERMISSION_LEVELS } from '../../../enums';
import ItemMembershipSelect from './ItemMembershipSelect';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  shortInputField: {
    width: '50%',
  },
  addedMargin: {
    marginTop: theme.spacing(2),
  },
  emailInput: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}));

const buildDefaultInvitation = () => ({
  // set temporary id for react-key
  id: v4(),
  email: '',
  permission: PERMISSION_LEVELS.READ,
});

const CreateItemMembershipForm = ({ itemId, members }) => {
  const [errors, setErrors] = useState(List([false]));

  const { mutate: postInvitations } = useMutation(
    MUTATION_KEYS.POST_INVITATIONS,
  );
  const { mutate: share } = useMutation(MUTATION_KEYS.POST_ITEM_MEMBERSHIP);
  const { t } = useTranslation();
  const classes = useStyles();

  // use an array to later allow sending multiple invitations
  const [invitations, setInvitations] = useState(
    List([buildDefaultInvitation()]),
  );

  const isInvitationInvalid = ({ email }) => {
    // check mail validity
    if (!email) {
      return t('The mail cannot be empty');
    }
    if (!validator.isEmail(email)) {
      return t('This mail is not valid');
    }
    // check mail does not already exist
    // TODO: check invitation at item level -> can create invitation in child
    if (members.find(({ email: thisEmail }) => thisEmail === email)) {
      return t(
        'You cannot share this item to this user because it already has some permissions',
      );
    }
    return false;
  };

  const handleInvite = async () => {
    const checks = invitations.map(isInvitationInvalid);

    if (checks.some(Boolean)) {
      return setErrors(checks);
    }

    // todo: handle multiple invitations
    // not good to check email for multiple invitations at once
    const idx = 0;
    const invitation = invitations.get(idx);
    const error = isInvitationInvalid(invitation);
    setErrors(errors.set(idx, error));

    if (error) {
      return error;
    }

    // check email has an associated account
    const accounts = await Api.getMemberBy(
      { email: invitation.email },
      {
        API_HOST,
      },
    );
    // if yes, create a membership
    if (accounts.length) {
      return share({
        id: itemId,
        email: invitation.email,
        permission: invitation.permission,
      });
    }
    // otherwise create invitation
    return postInvitations({
      itemId,
      invitations: invitations.toJS(),
    });
  };

  const onChangeEmail = (idx) => (event) => {
    const email = event.target.value;
    const newInvitations = invitations.update(idx, (invitation) => ({
      ...invitation,
      email,
    }));
    setInvitations(newInvitations);
    const error = isInvitationInvalid(newInvitations.get(idx));
    setErrors(errors.set(idx, error));
  };

  const renderInvitationStatus = () => (
    <Tooltip
      title={t(
        'Non-registered register on the platform will receive a personal link to register.',
      )}
    >
      <IconButton aria-label="status">
        <ErrorOutlineIcon />
      </IconButton>
    </Tooltip>
  );

  const renderButton = (idx) => {
    const disabled = Boolean(errors.get(idx));
    return (
      <Button onClick={handleInvite} disabled={disabled}>
        {t('Invite')}
      </Button>
    );
  };

  return (
    <Grid container spacing={1}>
      {invitations.map((invitation, idx) => (
        <Grid
          container
          alignItems="center"
          justify="center"
          key={invitation.id}
        >
          <Grid item xs={5}>
            <TextField
              value={invitation.email}
              className={classes.emailInput}
              id={SHARE_ITEM_EMAIL_INPUT_ID}
              variant="outlined"
              label={t('Email')}
              error={Boolean(errors.get(idx))}
              helperText={errors.get(idx)}
              onChange={onChangeEmail(idx)}
            />
          </Grid>
          <Grid item>
            <ItemMembershipSelect value={invitation.permission} />
          </Grid>
          <Grid item>{renderButton(idx)}</Grid>
          <Grid item>{renderInvitationStatus()}</Grid>
        </Grid>
      ))}
    </Grid>
  );
};

CreateItemMembershipForm.propTypes = {
  itemId: PropTypes.string.isRequired,
  members: PropTypes.instanceOf(List).isRequired,
};

export default CreateItemMembershipForm;
