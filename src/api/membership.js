import { getMemberBy } from './member';
import { API_HOST } from '../config/constants';
import { DEFAULT_GET, DEFAULT_POST } from './utils';
import {
  buildShareItemWithRoute,
  buildGetItemMembershipForItemRoute,
} from './routes';
import { MEMBER_NOT_FOUND_ERROR } from '../config/errors';

export const getMembershipsForItem = async ({ id }) => {
  const req = await fetch(
    `${API_HOST}/${buildGetItemMembershipForItemRoute(id)}`,
    DEFAULT_GET,
  );

  if (req.status !== 200) {
    throw new Error(req);
  }

  return req.json();
};

export const shareItemWith = async ({ id, email, permission }) => {
  const member = await getMemberBy({ email });
  // eslint-disable-next-line no-console
  if (!member) {
    throw new Error(MEMBER_NOT_FOUND_ERROR);
  }
  const req = await fetch(`${API_HOST}/${buildShareItemWithRoute(id)}`, {
    ...DEFAULT_POST,
    body: JSON.stringify({ memberId: member[0].id, permission }), // supposed to have only one member for this mail
  });

  return req.status === 200;
};
