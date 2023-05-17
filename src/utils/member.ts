import { List } from 'immutable';
import { validate } from 'uuid';

import { Member } from '@graasp/sdk';
import { MemberRecord } from '@graasp/sdk/frontend';

export const isMemberIdValid = (memberId: string): boolean =>
  validate(memberId?.trim());

export const getMemberById = (
  members: Member[],
  id: string,
): Member | undefined => members.find(({ id: thisId }) => id === thisId);

export const getFavoriteItems = (member?: MemberRecord): List<string> =>
  member?.extra?.favoriteItems || List();
