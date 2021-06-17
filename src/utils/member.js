import { validate } from 'uuid';

// eslint-disable-next-line import/prefer-default-export
export const isMemberIdValid = (memberId) => validate(memberId?.trim());

export const getMemberById = (members, id) =>
  members.find(({ id: thisId }) => id === thisId);
