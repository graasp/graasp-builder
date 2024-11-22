import { AccountType, DiscriminatedItem, ItemMembership } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';

export function useGuestMemberships(itemId: DiscriminatedItem['id']): {
  isLoading: boolean;
  data?: ItemMembership[];
} {
  const { data: memberships, isLoading } = hooks.useItemMemberships(itemId);

  const guestMemberships = memberships?.filter(
    ({ account: { type } }) => type === AccountType.Guest,
  );

  return { isLoading, data: guestMemberships };
}
