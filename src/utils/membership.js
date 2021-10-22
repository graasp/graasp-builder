import { PERMISSIONS_EDITION_ALLOWED } from '../config/constants';
import { PERMISSION_LEVELS } from '../enums';

export const isSettingsEditionAllowedForUser = ({ memberships, memberId }) =>
  memberships?.find(
    ({ memberId: mId, permission }) =>
      mId === memberId && PERMISSION_LEVELS.ADMIN === permission,
  );

export const isItemUpdateAllowedForUser = ({ memberships, memberId }) =>
  Boolean(
    memberships?.find(
      ({ memberId: mId, permission }) =>
        mId === memberId && PERMISSIONS_EDITION_ALLOWED.includes(permission),
    ),
  );

export const membershipsWithoutUser = (memberships, userId) =>
  memberships.filter(({ memberId }) => memberId !== userId);

export const getMembershipsForItem = ({ item, memberships, items }) => {
  const index = items.findKey(({ id }) => id === item.id);
  return memberships.get(index);
};
