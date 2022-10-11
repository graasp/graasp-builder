import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { MUTATION_KEYS } from '@graasp/query-client';

import { PASSWORD_EMPTY_ERROR } from '../../config/messages';
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

const PasswordSetting = () => {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const { mutate: updatePassword } = useMutation(MUTATION_KEYS.UPDATE_PASSWORD);

  const verifyEmptyPassword = () => {
    const checkingNewPassword = passwordValidator(newPassword);
    const checkingConfirmPassword = passwordValidator(confirmPassword);
    setNewPasswordError(checkingNewPassword);
    setConfirmPasswordError(checkingConfirmPassword);
    // throw error if one of the password fields is empty
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
      updatePassword({
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
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="flex-start"
        my={1}
      >
        <Grid item xs={8}>
          <Grid item xs={12}>
            <Typography variant="h5">{t('Change Password')}</Typography>
          </Grid>
          <Grid
            container
            spacing={3}
            display="flex"
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            my={1}
          >
            <Grid
              item
              xs={12}
              sm={12}
              display="flex"
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              <TextField
                required
                label={t('Current Password')}
                variant="outlined"
                value={currentPassword}
                onChange={handleCurrentPasswordInput}
                id={USER_CURRENT_PASSWORD_INPUT_ID}
                type="password"
              />
              <Typography variant="subtitle2">
                {t(
                  'Leave this field empty if you do not already have a password set.',
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
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
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              direction="column"
              justifyContent="flex-end"
              alignItems="flex-start"
            >
              <Button
                id={CONFIRM_CHANGE_PASSWORD_BUTTON_ID}
                variant="contained"
                color="primary"
                my={1}
                onClick={() => handleChangePassword()}
              >
                {t('Update password')}
              </Button>
              <Typography variant="caption">
                {t(
                  'Make sure it is at least 8 characters including a number, a lowercase letter and an uppercase letter.',
                )}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              direction="column"
              justifyContent="flex-end"
              alignItems="flex-start"
            >
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
    </>
  );
};

PasswordSetting.propTypes = {};

export default PasswordSetting;
