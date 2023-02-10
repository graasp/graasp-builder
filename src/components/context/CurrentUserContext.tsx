import { createContext, useContext, useEffect, useMemo } from 'react';
import { QueryObserverResult } from 'react-query';

import { MemberRecord } from '@graasp/sdk/frontend';

import i18n from '../../config/i18n';
import { hooks } from '../../config/queryClient';

type CurrentUserContextType = QueryObserverResult<MemberRecord> | null;

const CurrentUserContext = createContext<CurrentUserContextType>(null);

type Props = {
  children: JSX.Element | JSX.Element[];
};

const { useCurrentMember } = hooks;

export const CurrentUserContextProvider = ({
  children,
}: Props): JSX.Element => {
  const query = useCurrentMember();

  // update language depending on user setting
  const lang = query?.data?.extra?.lang as string;
  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => query, [query.data]);

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = (): CurrentUserContextType =>
  useContext(CurrentUserContext);
