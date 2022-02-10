import { PERMISSIONS_EDITION_ALLOWED } from '../config/constants';
import { PERMISSION_LEVELS } from '../enums';

// todo: better check with typescript
export const isError = (memberships) => memberships?.statusCode;

export const isItemUpdateAllowedForUser = ({ memberships, memberId }) =>
  Boolean(
    memberships?.find(
      ({ memberId: mId, permission }) =>
        mId === memberId && PERMISSIONS_EDITION_ALLOWED.includes(permission),
    ),
  );

export const getBestPermissionForMemberFromMemberships = ({
  memberships,
  memberId,
}) => {
  const itemMemberships = memberships?.filter(
    ({ memberId: mId }) => mId === memberId,
  );
  if (!itemMemberships) {
    return null;
  }

  const sorted = itemMemberships?.sort(
    (a, b) => a.itemPath.length > b.itemPath.length,
  );

  return sorted[0];
};

export const isSettingsEditionAllowedForUser = ({ memberships, memberId }) =>
  memberships?.find(
    ({ memberId: mId, permission }) =>
      mId === memberId && PERMISSION_LEVELS.ADMIN === permission,
  );

export const membershipsWithoutUser = (memberships, userId) =>
  memberships?.filter(({ memberId }) => memberId !== userId);

// util function to get the first membership from useMemberships
// this is necessary to detect errors
export const getMembership = (memberships) => {
  if (isError(memberships?.get(0))) {
    return undefined;
  }

  return memberships?.get(0);
};

export const getMembershipsForItem = ({ item, memberships, items }) => {
  const index = items.findKey(({ id }) => id === item.id);
  const m = memberships.get(index);
  if (isError(m)) {
    return undefined;
  }
  return m;
};
