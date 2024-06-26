import { FAILURE_MESSAGES } from '@graasp/translations';

import axios, { AxiosError } from 'axios';

export const getErrorFromPayload = (
  inputError?: Error | AxiosError,
): { name: string; message: string } => {
  const defaultError = {
    name: FAILURE_MESSAGES.UNEXPECTED_ERROR,
    message: FAILURE_MESSAGES.UNEXPECTED_ERROR,
  };
  if (inputError && axios.isAxiosError(inputError)) {
    const errorData = inputError.response?.data;
    const result = { name: errorData?.name, message: errorData?.message };
    return result;
  }

  return {
    ...defaultError,
    message: inputError?.message ?? FAILURE_MESSAGES.UNEXPECTED_ERROR,
  };
};
