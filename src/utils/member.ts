import { Member } from '@graasp/sdk';

// eslint-disable-next-line import/prefer-default-export
export const getMemberById = (
  members: Member[],
  id: string,
): Member | undefined => members.find(({ id: thisId }) => id === thisId);
