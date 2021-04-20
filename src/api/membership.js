import { getMemberBy } from './member';
import { API_HOST } from '../config/constants';
import { failOnError, DEFAULT_GET, DEFAULT_POST } from './utils';
import {
  buildShareItemWithRoute,
  buildGetItemMembershipForItemRoute,
} from './routes';
import { MEMBER_NOT_FOUND_ERROR } from '../config/errors';

export const getMembershipsForItem = async (id) => {
  const res = await fetch(
    `${API_HOST}/${buildGetItemMembershipForItemRoute(id)}`,
    DEFAULT_GET,
  ).then(failOnError);

  return res.json();
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
