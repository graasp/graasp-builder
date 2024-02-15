import { DiscriminatedItem, ItemMembership } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';
import { isItemUpdateAllowedForUser } from '@/utils/membership';

// eslint-disable-next-line import/prefer-default-export
export const useCanUpdateItem = (
  item?: DiscriminatedItem,
): {
  allowed: boolean;
  memberships?: ItemMembership[];
  isMembershipsLoading: boolean;
} => {
  const { data: memberships, isLoading: isMembershipsLoading } =
    hooks.useItemMemberships(item?.id);
  const { data: currentMember } = hooks.useCurrentMember();

  const allowed = isItemUpdateAllowedForUser({
    memberships,
    memberId: currentMember?.id,
  });

  return { allowed, memberships, isMembershipsLoading };
};
