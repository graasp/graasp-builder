import { validate } from 'uuid';

export const isMemberIdValid = (memberId) => validate(memberId?.trim());

export const getMemberById = (members, id) =>
  members.find(({ id: thisId }) => id === thisId);
