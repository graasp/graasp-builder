import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Button, TextField } from '@material-ui/core';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../config/queryClient';
import {
  CONFIRM_CHANGE_PASSWORD_BUTTON_ID,
  CONFIRM_RESET_PASSWORD_BUTTON_ID,
  USER_CONFIRM_PASSWORD_INPUT_ID,
  USER_CURRENT_PASSWORD_INPUT_ID,
  USER_NEW_PASSWORD_INPUT_ID,
} from '../../config/selectors';
import {
  newPasswordValidator,
  passwordValidator,
  strengthValidator,
} from '../../utils/validation';
import { PASSWORD_EMPTY_ERROR } from '../../config/messages';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: theme.spacing(1, 0),
  },
  changePasswordContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
  },
  buttonItem: {
    display: 'flex',
    padding: theme.spacing(1),
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
}));

const PasswordSetting = ({ user }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const { mutate: onUpdatePassword } = useMutation(
    MUTATION_KEYS.UPDATE_PASSWORD,
  );

  const userId = user.get('id');
  const hasPassword = user.get('password');

  const verifyEmptyPassword = () => {
    const checkingCurrentPassword = passwordValidator(currentPassword);
    const checkingNewPassword = passwordValidator(newPassword);
    const checkingConfirmPassword = passwordValidator(confirmPassword);
    setCurrentPasswordError(checkingCurrentPassword);
    setNewPasswordError(checkingNewPassword);
    setConfirmPasswordError(checkingConfirmPassword);
    // throw error if one of the password fields is empty
    if (hasPassword) {
      // check all three fields if the user already has a password set
      if (
        checkingCurrentPassword ||
        checkingNewPassword ||
        checkingConfirmPassword
      ) {
        throw PASSWORD_EMPTY_ERROR;
      }
    }
    // only check two fields if the user does not have a password set
    if (checkingNewPassword || checkingConfirmPassword) {
      throw PASSWORD_EMPTY_ERROR;
    }
  };

  const onClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangePassword = () => {
    try {
      // verify there are no empty inputs
      verifyEmptyPassword();
      // perform validation when all fields are filled in
      newPasswordValidator(currentPassword, newPassword, confirmPassword);
      // check password strength for new password
      strengthValidator(newPassword);
      // perform password update
      onUpdatePassword({
        id: userId,
        password: newPassword,
        currentPassword,
      });
      onClose();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleCurrentPasswordInput = (event) => {
    setCurrentPassword(event.target.value);
    setCurrentPasswordError(passwordValidator(event.target.value));
  };
  const handleNewPasswordInput = (event) => {
    setNewPassword(event.target.value);
    setNewPasswordError(passwordValidator(event.target.value));
  };
  const handleConfirmPasswordInput = (event) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError(passwordValidator(event.target.value));
  };

  return (
    <>
      <Grid container spacing={3} className={classes.mainContainer}>
        <Grid item xs={8}>
          <Grid item xs={12}>
            <Typography variant="h5">
              {hasPassword ? (
                <div>{t('Change Password')}</div>
              ) : (
                <div>{t('Set Password')}</div>
              )}
            </Typography>
          </Grid>
          <Grid
            container
            spacing={3}
            className={classes.changePasswordContainer}
          >
            <Grid item xs={12} sm={12}>
              {hasPassword ? (
                <TextField
                  className={classes.input}
                  required
                  label={t('Current Password')}
                  variant="outlined"
                  value={currentPassword}
                  error={currentPasswordError}
                  helperText={currentPasswordError}
                  onChange={handleCurrentPasswordInput}
                  id={USER_CURRENT_PASSWORD_INPUT_ID}
                  type="password"
                />
              ) : (
                <Grid item xs={12} sm={6} />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.input}
                required
                label={t('New Password')}
                variant="outlined"
                value={newPassword}
                error={newPasswordError}
                helperText={newPasswordError}
                onChange={handleNewPasswordInput}
                id={USER_NEW_PASSWORD_INPUT_ID}
                type="password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.input}
                required
                label={t('Confirm Password')}
                variant="outlined"
                value={confirmPassword}
                error={confirmPasswordError}
                helperText={confirmPasswordError}
                onChange={handleConfirmPasswordInput}
                id={USER_CONFIRM_PASSWORD_INPUT_ID}
                type="password"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Grid container>
                <Grid item xs={12} sm={6} className={classes.buttonItem}>
                  <Typography variant="caption">
                    {t(
                      'Make sure it is at least 8 characters including a number, a lowercase letter and an uppercase letter.',
                    )}
                  </Typography>
                  <Button
                    id={CONFIRM_CHANGE_PASSWORD_BUTTON_ID}
                    variant="contained"
                    color="primary"
                    onClick={() => handleChangePassword()}
                  >
                    {t('Update password')}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.buttonItem}>
                  <Typography variant="caption">
                    {t('I forgot my password:')}
                  </Typography>
                  <Button
                    id={CONFIRM_RESET_PASSWORD_BUTTON_ID}
                    variant="outlined"
                    disabled
                    // TO DO:
                    // onClick={() => handleChangePassword()}
                  >
                    {t('Request a reset')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

PasswordSetting.propTypes = {
  user: PropTypes.instanceOf(Map).isRequired,
};

export default PasswordSetting;
