import { List } from 'immutable';

import { PermissionLevel } from '@graasp/sdk';
import { ItemMembershipRecord, ItemRecord } from '@graasp/sdk/frontend';

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
  memberId: string;
}): boolean =>
  Boolean(
    memberships?.find(
      ({ memberId: mId, permission }) =>
        mId === memberId && PERMISSIONS_EDITION_ALLOWED.includes(permission),
    ),
  );

// get highest permission a member have over an item,
// longer the itemPath, deeper is the permission, thus highested
export const getHighestPermissionForMemberFromMemberships = ({
  memberships,
  memberId,
}: {
  memberships?: List<ItemMembershipRecord>;
  memberId: string;
}): null | ItemMembershipRecord => {
  const itemMemberships = memberships?.filter(
    ({ memberId: mId }) => mId === memberId,
  );
  if (!itemMemberships) {
    return null;
  }

  const sorted = itemMemberships?.sort((a, b) =>
    a.itemPath.length > b.itemPath.length ? 1 : -1,
  );

  return sorted.first();
};

export const isSettingsEditionAllowedForUser = ({
  memberships,
  memberId,
}: {
  memberships: List<ItemMembershipRecord>;
  memberId: string;
}): boolean =>
  memberships?.some(
    ({ memberId: mId, permission }) =>
      mId === memberId && PermissionLevel.Admin === permission,
  );

export const membershipsWithoutUser = (
  memberships: List<ItemMembershipRecord>,
  userId: string,
): List<ItemMembershipRecord> =>
  memberships?.filter(({ memberId }) => memberId !== userId);

export const getMembershipsForItem = ({
  itemId,
  manyMemberships,
  items,
}: {
  itemId: string;
  manyMemberships: List<List<ItemMembershipRecord>>;
  items: List<ItemRecord>;
}): List<ItemMembershipRecord> | undefined => {
  const index = items.findKey(({ id }) => id === itemId);
  const m = manyMemberships?.get(index as number);
  if (isError(m)) {
    return undefined;
  }
  return m;
};
