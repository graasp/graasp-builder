import { List } from 'immutable';

import { ItemMembership, PermissionLevel } from '@graasp/sdk';
import { ItemMembershipRecord, ResultOfRecord } from '@graasp/sdk/frontend';

import { PERMISSIONS_EDITION_ALLOWED } from '../config/constants';

// todo: better check with typescript
export const isError = (
  membership?:
    | ItemMembershipRecord
    | List<ItemMembershipRecord>
    | { statusCode: unknown },
): boolean | undefined =>
  membership && typeof membership === 'object' && 'statusCode' in membership;

export const isItemUpdateAllowedForUser = ({
  memberships,
  memberId,
}: {
  memberships?: List<ItemMembershipRecord>;
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

// get highest permission a member have over an item,
// longer the itemPath, deeper is the permission, thus highested
export const getHighestPermissionForMemberFromMemberships = ({
  memberships,
  memberId,
}: {
  memberships?: List<ItemMembershipRecord>;
  memberId?: string;
}): null | ItemMembershipRecord => {
  if (!memberId) {
    return null;
  }

  const itemMemberships = memberships?.filter(
    ({ member: { id: mId } }) => mId === memberId,
  );
  if (!itemMemberships) {
    return null;
  }

  const sorted = itemMemberships?.sort((a, b) =>
    a.item.path.length > b.item.path.length ? 1 : -1,
  );

  return sorted.first();
};

export const isSettingsEditionAllowedForUser = ({
  memberships,
  memberId,
}: {
  memberships?: List<ItemMembershipRecord>;
  memberId?: string;
}): boolean =>
  !memberships
    ? false
    : memberships.some(
        ({ member: { id: mId }, permission }) =>
          mId === memberId && PermissionLevel.Admin === permission,
      );

export const membershipsWithoutUser = (
  memberships: List<ItemMembershipRecord>,
  userId?: string,
): List<ItemMembershipRecord> =>
  memberships?.filter(({ member: { id: memberId } }) => memberId !== userId);

export const getMembershipsForItem = ({
  itemId,
  manyMemberships,
}: {
  itemId: string;
  manyMemberships: ResultOfRecord<ItemMembership[]>;
}): List<ItemMembershipRecord> | undefined => manyMemberships?.data?.[itemId];
