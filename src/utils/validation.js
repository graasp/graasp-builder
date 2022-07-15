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
    throw PASSWORD_WEAK_ERROR;
  }
  return true;
};

export const passwordValidator = (password) => {
  let res = false;
  if (validator.isEmpty(password)) {
    res = PASSWORD_EMPTY_ERROR;
  }
  return res;
};

export const newPasswordValidator = (
  currentPassword,
  newPassword,
  confirmPassword,
) => {
  if (currentPassword === newPassword) {
    throw PASSWORD_EQUAL_ERROR;
  }
  if (newPassword !== confirmPassword) {
    throw PASSWORD_CONFIRM_ERROR;
  }
  return true;
};
