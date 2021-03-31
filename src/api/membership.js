import { getMemberBy } from './member';
import { API_HOST } from '../config/constants';
import { failOnError, DEFAULT_GET, DEFAULT_POST } from './utils';
import {
  buildShareItemWithRoute,
  buildGetItemMembershipForItemRoute,
} from './routes';
import { MEMBER_NOT_FOUND_ERROR } from '../config/errors';
import * as CacheOperations from '../config/cache';

export const getMembershipsForItem = async (id) => {
  const res = await fetch(
    `${API_HOST}/${buildGetItemMembershipForItemRoute(id)}`,
    DEFAULT_GET,
  ).then(failOnError);

  const item = await res.json();
  await CacheOperations.saveItem(item);

  return item;
};

export const shareItemWith = async ({ id, email, permission }) => {
  const member = await getMemberBy({ email });
  if (!member) {
    throw new Error(MEMBER_NOT_FOUND_ERROR);
  }
  const res = await fetch(`${API_HOST}/${buildShareItemWithRoute(id)}`, {
    ...DEFAULT_POST,
    body: JSON.stringify({ memberId: member[0].id, permission }), // supposed to have only one member for this mail
  }).then(failOnError);

  return res.ok;
};
