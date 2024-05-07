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
  memberships?.filter(({ member: { id: memberId } }) => memberId !== userId);

interface PermissionMap {
  [key: string]: ItemMembership;
}

export const selectHighestMemberships = (
  memberships: ItemMembership[],
): ItemMembership[] => {
  const permissionMap = memberships.reduce<PermissionMap>((acc, curr) => {
    const { member, permission } = curr;

    if (
      !acc[member.id] ||
      PermissionLevelCompare.gt(permission, acc[member.id].permission)
    ) {
      acc[member.id] = curr;
    }
    return acc;
  }, {});

  return Object.values(permissionMap);
};
