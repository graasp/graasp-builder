import { Member } from '@graasp/sdk';

export const getMemberById = (
  members: Member[],
  id: string,
): Member | undefined => members.find(({ id: thisId }) => id === thisId);
