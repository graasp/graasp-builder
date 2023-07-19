import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ChangeEvent, useState } from 'react';

import { isPasswordStrong } from '@graasp/sdk';
import { ACCOUNT, FAILURE_MESSAGES } from '@graasp/translations';

import { useAccountTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import {
  CONFIRM_CHANGE_PASSWORD_BUTTON_ID,
  CONFIRM_RESET_PASSWORD_BUTTON_ID,
  USER_CONFIRM_PASSWORD_INPUT_ID,
  USER_CURRENT_PASSWORD_INPUT_ID,
  USER_NEW_PASSWORD_INPUT_ID,
} from '../../config/selectors';

const PasswordSetting = (): JSX.Element => {
  const { t: translateAccount } = useAccountTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState<string | null>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >();
  const { mutate: updatePassword } = mutations.useUpdatePassword();

  const verifyEmptyPassword = () => {
    const newPasswordIsNotEmpty = Boolean(newPassword);
    const confirmPasswordIsNotEmpty = Boolean(confirmPassword);
    setNewPasswordError(
      newPasswordIsNotEmpty ? null : FAILURE_MESSAGES.PASSWORD_EMPTY_ERROR,
    );
    setConfirmPasswordError(
      confirmPasswordIsNotEmpty ? null : FAILURE_MESSAGES.PASSWORD_EMPTY_ERROR,
    );

    return newPasswordIsNotEmpty || confirmPasswordIsNotEmpty;
  };

  const onClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangePassword = () => {
    // verify there are no empty inputs
    const isValid = verifyEmptyPassword();

    if (isValid) {
      // perform validation when all fields are filled in
      if (currentPassword === newPassword) {
        return setNewPasswordError(FAILURE_MESSAGES.PASSWORD_EQUAL_ERROR);
      }
      if (newPassword !== confirmPassword) {
        return setConfirmPasswordError(FAILURE_MESSAGES.PASSWORD_CONFIRM_ERROR);
      }

      // check password strength for new password
      if (!isPasswordStrong(newPassword)) {
        return setNewPasswordError(FAILURE_MESSAGES.PASSWORD_WEAK_ERROR);
      }

      // perform password update
      updatePassword({
        password: newPassword,
        currentPassword,
      });
    }

    return onClose();
  };

  const handleCurrentPasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(event.target.value);
  };
  const handleNewPasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
    setNewPasswordError(event.target.value ? null : 'Password is empty');
  };
  const handleConfirmPasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError(event.target.value ? null : 'Password is empty');
  };

  return (
    <Grid container spacing={1} direction="column" my={1}>
      <Grid item xs={12}>
        <Typography variant="h5">
          {translateAccount(ACCOUNT.PASSWORD_SETTINGS_TITLE)}
        </Typography>
        <Typography variant="body1">
          {translateAccount(ACCOUNT.PASSWORD_SETTINGS_CONFIRM_INFORMATION)}
        </Typography>
      </Grid>
      <Grid container spacing={2} my={1}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            label={translateAccount(ACCOUNT.PASSWORD_SETTINGS_CURRENT_LABEL)}
            variant="outlined"
            value={currentPassword}
            onChange={handleCurrentPasswordInput}
            id={USER_CURRENT_PASSWORD_INPUT_ID}
            type="password"
          />
          <Typography variant="subtitle2">
            {translateAccount(ACCOUNT.PASSWORD_SETTINGS_CURRENT_INFORMATION)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            label={translateAccount(ACCOUNT.PASSWORD_SETTINGS_NEW_LABEL)}
            variant="outlined"
            value={newPassword}
            error={Boolean(newPasswordError)}
            helperText={newPasswordError}
            onChange={handleNewPasswordInput}
            id={USER_NEW_PASSWORD_INPUT_ID}
            type="password"
            sx={{ mr: 2 }}
          />
          <TextField
            required
            label={translateAccount(
              ACCOUNT.PASSWORD_SETTINGS_NEW_CONFIRM_LABEL,
            )}
            variant="outlined"
            value={confirmPassword}
            error={Boolean(confirmPasswordError)}
            helperText={confirmPasswordError}
            onChange={handleConfirmPasswordInput}
            id={USER_CONFIRM_PASSWORD_INPUT_ID}
            type="password"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            id={CONFIRM_RESET_PASSWORD_BUTTON_ID}
            variant="outlined"
            disabled
            sx={{ mr: 2 }}
            // TO DO:
            // onClick={() => handleChangePassword()}
          >
            {translateAccount(ACCOUNT.PASSWORD_SETTINGS_REQUEST_RESET_BUTTON)}
          </Button>
          <Button
            id={CONFIRM_CHANGE_PASSWORD_BUTTON_ID}
            variant="contained"
            color="primary"
            onClick={() => handleChangePassword()}
            sx={{ my: 1 }}
          >
            {translateAccount(ACCOUNT.PASSWORD_SETTINGS_CONFIRM_BUTTON)}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PasswordSetting;
