import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@graasp/ui';
import { Grid, makeStyles, TextField } from '@material-ui/core';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useTranslation } from 'react-i18next';
import validator from 'validator';
import { useMutation } from '../../../config/queryClient';
import {
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
} from '../../../config/selectors';
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

const CreateItemMembershipForm = ({ id }) => {
  const [mailError, setMailError] = useState(false);
  const [email, setEmail] = useState('');
  const mutation = useMutation(MUTATION_KEYS.SHARE_ITEM);
  const { t } = useTranslation();
  const classes = useStyles();

  // refs
  let permission = '';

  const checkSubmission = () => {
    // check mail validity
    if (!validator.isEmail(email)) {
      setMailError(t('This mail is not valid'));
      return false;
    }

    // todo: check mail does not already exist
    // but this is difficult to check as membership contains memberId != email

    setMailError(null);
    return true;
  };

  const submit = () => {
    if (checkSubmission()) {
      mutation.mutate({
        id,
        email,
        permission: permission.value,
      });
      setEmail('');
    }
  };

  const onChangeEmail = ({ target }) => {
    setEmail(target.value);
  };

  return (
    <Grid container spacing={1} alignItems="center" justifyContent="center">
      <Grid item xs={7}>
        <TextField
          className={classes.emailInput}
          id={SHARE_ITEM_EMAIL_INPUT_ID}
          variant="outlined"
          value={email}
          onChange={onChangeEmail}
          label={t('Email')}
          error={Boolean(mailError)}
          helperText={mailError}
        />
      </Grid>
      <Grid item>
        <ItemMembershipSelect
          inputRef={(c) => {
            permission = c;
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <Button onClick={submit} id={SHARE_ITEM_SHARE_BUTTON_ID}>
          {t('Share')}
        </Button>
      </Grid>
    </Grid>
  );
};

CreateItemMembershipForm.propTypes = {
  id: PropTypes.string.isRequired,
};

export default CreateItemMembershipForm;
