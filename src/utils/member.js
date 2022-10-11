import { List } from 'immutable';
import { validate } from 'uuid';

export const isMemberIdValid = (memberId) => validate(memberId?.trim());

export const getMemberById = (members, id) =>
  members.find(({ id: thisId }) => id === thisId);

export const getMemberAvatar = (extra) => extra?.avatar;

export const getFavoriteItems = (extra) => extra?.favoriteItems || List();
