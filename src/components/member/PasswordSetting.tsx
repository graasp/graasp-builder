import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { MUTATION_KEYS } from '@graasp/query-client';
import { ACCOUNT, namespaces } from '@graasp/translations';

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

const PasswordSetting: FC = () => {
  const { t: accountT } = useTranslation(namespaces.account);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState<string>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();
  const { mutate: updatePassword } = useMutation<any, any, any>(
    MUTATION_KEYS.UPDATE_PASSWORD,
  );

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
      <Grid container spacing={1} direction="column" my={1}>
        <Grid item xs={12}>
          <Typography variant="h5">
            {accountT(ACCOUNT.PASSWORD_SETTINGS_TITLE)}
          </Typography>
          <Typography variant="body1">
            {accountT(ACCOUNT.PASSWORD_SETTINGS_CONFIRM_INFORMATION)}
          </Typography>
        </Grid>
        <Grid container spacing={2} my={1}>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              label={accountT(ACCOUNT.PASSWORD_SETTINGS_CURRENT_LABEL)}
              variant="outlined"
              value={currentPassword}
              onChange={handleCurrentPasswordInput}
              id={USER_CURRENT_PASSWORD_INPUT_ID}
              type="password"
            />
            <Typography variant="subtitle2">
              {accountT(ACCOUNT.PASSWORD_SETTINGS_CURRENT_INFORMATION)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label={accountT(ACCOUNT.PASSWORD_SETTINGS_NEW_LABEL)}
              variant="outlined"
              value={newPassword}
              error={newPasswordError}
              helperText={newPasswordError}
              onChange={handleNewPasswordInput}
              id={USER_NEW_PASSWORD_INPUT_ID}
              type="password"
              sx={{ mr: 2 }}
            />
            <TextField
              required
              label={accountT(ACCOUNT.PASSWORD_SETTINGS_NEW_CONFIRM_LABEL)}
              variant="outlined"
              value={confirmPassword}
              error={confirmPasswordError}
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
              {accountT(ACCOUNT.PASSWORD_SETTINGS_REQUEST_RESET_BUTTON)}
            </Button>
            <Button
              id={CONFIRM_CHANGE_PASSWORD_BUTTON_ID}
              variant="contained"
              color="primary"
              my={1}
              onClick={() => handleChangePassword()}
            >
              {accountT(ACCOUNT.PASSWORD_SETTINGS_CONFIRM_BUTTON)}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default PasswordSetting;
