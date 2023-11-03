import { ItemMembership, PermissionLevel, ResultOf } from '@graasp/sdk';

import { PERMISSIONS_EDITION_ALLOWED } from '../config/constants';

// todo: better check with typescript
export const isError = (
  membership?: ItemMembership | ItemMembership[] | { statusCode: unknown },
): boolean | undefined =>
  membership && typeof membership === 'object' && 'statusCode' in membership;

export const isItemUpdateAllowedForUser = ({
  memberships,
  memberId,
}: {
  memberships?: ItemMembership[];
  memberId?: string;
}): boolean => {
  // the user is not authenticated so he cannot update
  if (!memberId) {
    return false;
  }

  return Boolean(
    memberships?.find(
      ({ member: { id: mId }, permission }) =>
        mId === memberId && PERMISSIONS_EDITION_ALLOWED.includes(permission),
    ),
  );
};

export const isItemAdminAllowedForMember = ({
  memberships,
  memberId,
  itemPath,
}: {
  memberships?: ItemMembership[];
  memberId?: string;
  itemPath: string;
}): boolean => {
  // the user is not authenticated so he cannot administrate
  if (!memberId) {
    return false;
  }

  return Boolean(
    memberships?.find(
      ({ member: { id: mId }, permission, item }) =>
        mId === memberId &&
        permission === PermissionLevel.Admin &&
        itemPath.startsWith(item.path),
    ),
  );
};

// get highest permission a member have over an item,
// longer the itemPath, deeper is the permission, thus highested
export const getHighestPermissionForMemberFromMemberships = ({
  memberships,
  memberId,
}: {
  memberships?: ItemMembership[];
  memberId?: string;
}): null | ItemMembership => {
  if (!memberId) {
    return null;
  }

  const itemMemberships = memberships?.filter(
    ({ member: { id: mId } }) => mId === memberId,
  );
  if (!itemMemberships) {
    return null;
  }

  const sorted = [...itemMemberships];
  sorted?.sort((a, b) => (a.item.path.length > b.item.path.length ? 1 : -1));

  return sorted[0];
};

export const isSettingsEditionAllowedForUser = ({
  memberships,
  memberId,
}: {
  memberships?: ItemMembership[];
  memberId?: string;
}): boolean =>
  !memberships
    ? false
    : memberships.some(
        ({ member: { id: mId }, permission }) =>
          mId === memberId && PermissionLevel.Admin === permission,
      );

export const membershipsWithoutUser = (
  memberships: ItemMembership[],
  userId?: string,
): ItemMembership[] =>
  memberships?.filter(({ member: { id: memberId } }) => memberId !== userId);

export const getMembershipsForItem = ({
  itemId,
  manyMemberships,
}: {
  itemId: string;
  manyMemberships?: ResultOf<ItemMembership[]>;
}): ItemMembership[] | undefined => manyMemberships?.data?.[itemId];
