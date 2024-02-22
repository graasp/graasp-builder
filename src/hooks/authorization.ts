import {
  DiscriminatedItem,
  ItemMembership,
  PermissionLevel,
} from '@graasp/sdk';

import { hooks } from '@/config/queryClient';
import { getHighestPermissionForMemberFromMemberships } from '@/utils/item';

// todo: to be replaced by a query client hook get item that would contain the permission
// eslint-disable-next-line import/prefer-default-export
export const useGetPermissionForItem = (
  item?: DiscriminatedItem,
  allMemberships?: ItemMembership[],
): {
  data?: PermissionLevel;
  memberships?: ItemMembership[];
  isMembershipsLoading: boolean;
  isCurrentMemberLoading: boolean;
  isLoading: boolean;
} => {
  // does not fetch memberships if they are given
  const { data: memberships, isLoading: isMembershipsLoading } =
    hooks.useItemMemberships(allMemberships ? undefined : item?.id);
  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    hooks.useCurrentMember();
  const isLoading = isMembershipsLoading || isCurrentMemberLoading;

  return {
    data: item
      ? getHighestPermissionForMemberFromMemberships({
          memberships: allMemberships ?? memberships,
          memberId: currentMember?.id,
          itemPath: item?.path,
        })?.permission
      : undefined,
    isLoading,
    memberships,
    isMembershipsLoading,
    isCurrentMemberLoading,
  };
};
