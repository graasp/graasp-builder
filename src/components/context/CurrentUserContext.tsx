import { ReactNode, createContext, useContext, useEffect } from 'react';

import { AccountType } from '@graasp/sdk';
import { DEFAULT_LANG } from '@graasp/translations';

import i18n from '../../config/i18n';
import { hooks } from '../../config/queryClient';

const { useCurrentMember } = hooks;

type CurrentUserContextType = ReturnType<typeof useCurrentMember>;

const CurrentUserContext = createContext<CurrentUserContextType>(
  {} as CurrentUserContextType,
);

type Props = {
  children: ReactNode;
};

export const CurrentUserContextProvider = ({ children }: Props): ReactNode => {
  const { data } = useCurrentMember();

  // update language depending on user setting
  useEffect(() => {
    const lang =
      data?.type === AccountType.Individual
        ? data?.extra?.lang || DEFAULT_LANG
        : DEFAULT_LANG;
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [data]);

  return children;
};

export const useCurrentUserContext = (): CurrentUserContextType =>
  useContext(CurrentUserContext);
