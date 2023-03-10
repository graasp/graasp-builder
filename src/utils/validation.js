import validator from 'validator';

import { FAILURE_MESSAGES } from '@graasp/translations';

export const strengthValidator = (password) => {
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    throw FAILURE_MESSAGES.PASSWORD_WEAK_ERROR;
  }
  return true;
};

export const passwordValidator = (password) => {
  let res = false;
  if (validator.isEmpty(password)) {
    res = FAILURE_MESSAGES.PASSWORD_EMPTY_ERROR;
  }
  return res;
};

export const newPasswordValidator = (
  currentPassword,
  newPassword,
  confirmPassword,
) => {
  if (currentPassword === newPassword) {
    throw FAILURE_MESSAGES.PASSWORD_EQUAL_ERROR;
  }
  if (newPassword !== confirmPassword) {
    throw FAILURE_MESSAGES.PASSWORD_CONFIRM_ERROR;
  }
  return true;
};
