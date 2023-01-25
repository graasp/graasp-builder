import { List } from 'immutable';

import { ItemMembershipRecord } from '@graasp/query-client/dist/types';
import { PermissionLevel } from '@graasp/sdk';
import { ItemRecord } from '@graasp/ui/dist/types';

import { PERMISSIONS_EDITION_ALLOWED } from '../config/constants';

// todo: better check with typescript
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isError = (membership: any): boolean =>
  Boolean(membership?.statusCode);

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
  memberships: List<ItemMembershipRecord>;
  memberId: string;
}): ItemMembershipRecord => {
  const itemMemberships = memberships?.filter(
    ({ memberId: mId }) => mId === memberId,
  );
  if (!itemMemberships) {
    return null;
  }

  const sorted = itemMemberships?.sort((a, b) =>
    a.itemPath.length > b.itemPath.length ? 1 : -1,
  );

  return sorted[0];
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

// util function to get the first membership from useMemberships
// this is necessary to detect errors
export const getMembership = (
  memberships: List<ItemMembershipRecord>,
): ItemMembershipRecord => {
  if (isError(memberships?.get(0))) {
    return undefined;
  }

  return memberships?.get(0);
};

export const getMembershipsForItem = ({
  item,
  membershipLists,
  items,
}: {
  item: ItemRecord;
  items: List<ItemRecord>;
  membershipLists: List<List<ItemMembershipRecord>>;
}): List<ItemMembershipRecord> | undefined => {
  const index = items.findKey(({ id }) => id === item.id);
  const m = membershipLists?.get(index);
  if (isError(m)) {
    return undefined;
  }
  return m;
};
