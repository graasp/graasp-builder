import { ItemMembership, ResultOf } from '@graasp/sdk';

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

export const getMembershipsForItem = ({
  itemId,
  manyMemberships,
}: {
  itemId: string;
  manyMemberships?: ResultOf<ItemMembership[]>;
}): ItemMembership[] | undefined => manyMemberships?.data?.[itemId];
