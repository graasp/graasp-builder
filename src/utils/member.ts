import { AccountType, CurrentAccount, Member } from '@graasp/sdk';
import { DEFAULT_LANG } from '@graasp/translations';

export const getMemberById = (
  members: Member[],
  id: string,
): Member | undefined => members.find(({ id: thisId }) => id === thisId);

export const getCurrentAccountLang = (
  account: CurrentAccount | null | undefined,
  // eslint-disable-next-line arrow-body-style
): string | undefined => {
  if (account?.type === AccountType.Individual) {
    return account.extra.lang;
  }
  return DEFAULT_LANG;
};
