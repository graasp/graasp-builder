import { ItemMembership, PermissionLevelCompare } from '@graasp/sdk';

// todo: better check with typescript
export const isError = (
  membership?: ItemMembership | ItemMembership[] | { statusCode: unknown },
): boolean | undefined =>
  membership && typeof membership === 'object' && 'statusCode' in membership;

export const membershipsWithoutUser = (
  memberships: ItemMembership[],
  userId?: string,
): ItemMembership[] =>
  memberships?.filter(({ account: { id: memberId } }) => memberId !== userId);

interface PermissionMap {
  [key: string]: ItemMembership;
}

export const selectHighestMemberships = (
  memberships: ItemMembership[],
): ItemMembership[] => {
  const permissionMap = memberships.reduce<PermissionMap>((acc, curr) => {
    const { account, permission } = curr;

    if (
      !acc[account.id] ||
      PermissionLevelCompare.gt(permission, acc[account.id].permission)
    ) {
      acc[account.id] = curr;
    }
    return acc;
  }, {});

  return Object.values(permissionMap);
};
