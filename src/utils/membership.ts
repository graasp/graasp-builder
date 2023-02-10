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
  memberships: List<ItemMembershipRecord>;
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
  return sorted.get(0);
};

export const isSettingsEditionAllowedForUser = ({
  memberships,
  memberId,
}: {
  memberships?: List<ItemMembershipRecord>;
  memberId: string;
}): ItemMembershipRecord | undefined =>
  memberships?.find(
    ({ memberId: mId, permission }) =>
      mId === memberId && PermissionLevel.Admin === permission,
  );

export const membershipsWithoutUser = (
  memberships: List<ItemMembershipRecord>,
  userId: string,
): List<ItemMembershipRecord> =>
  memberships?.filter(({ memberId }) => memberId !== userId);

// todo: Is this used ? Can we remove it ?
// util function to get the first membership from useMemberships
// this is necessary to detect errors
export const getMembership = (
  memberships?: List<ItemMembershipRecord>,
): ItemMembershipRecord | undefined => {
  if (isError(memberships?.get(0))) {
    return undefined;
  }

  return memberships?.get(0);
};

export const getMembershipsForItem = ({
  item,
  manyMemberships,
  items,
}: {
  item: ItemRecord;
  manyMemberships: List<List<ItemMembershipRecord>>;
  items: List<ItemRecord>;
}): List<ItemMembershipRecord> | undefined => {
  const index = items.findKey(({ id }) => id === item.id);
  const m = manyMemberships?.get(index);
  if (isError(m)) {
    return undefined;
  }
  return m;
};
