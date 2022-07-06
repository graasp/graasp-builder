import validator from 'validator';

import {
  PASSWORD_CONFIRM_ERROR,
  PASSWORD_EMPTY_ERROR,
  PASSWORD_EQUAL_ERROR,
  PASSWORD_WEAK_ERROR,
} from '../config/messages';

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
    return PASSWORD_WEAK_ERROR;
  }
  return null;
};

export const passwordValidator = (password) => {
  if (validator.isEmpty(password)) {
    return PASSWORD_EMPTY_ERROR;
  }
  return null;
};

export const newPasswordValidator = (
  currentPassword,
  newPassword,
  confirmPassword,
) => {
  if (currentPassword === newPassword) {
    return PASSWORD_EQUAL_ERROR;
  }
  if (newPassword !== confirmPassword) {
    return PASSWORD_CONFIRM_ERROR;
  }
  return null;
};
