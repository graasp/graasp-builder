import { validate } from 'uuid';

// eslint-disable-next-line import/prefer-default-export
export const isMemberIdValid = (memberId) => validate(memberId?.trim());
