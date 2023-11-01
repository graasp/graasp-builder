import { createContext, useContext, useEffect, useMemo } from 'react';
import { QueryObserverResult } from 'react-query';

import { CompleteMember } from '@graasp/sdk';

import i18n from '../../config/i18n';
import { hooks } from '../../config/queryClient';

type CurrentUserContextType =
  | QueryObserverResult<null | CompleteMember>
  | Record<string, never>;

const CurrentUserContext = createContext<CurrentUserContextType>({});

type Props = {
  children: JSX.Element | JSX.Element[];
};

const { useCurrentMember } = hooks;

export const CurrentUserContextProvider = ({
  children,
}: Props): JSX.Element => {
  const query = useCurrentMember();

  // update language depending on user setting
  // todo: this cast can be resolved if we don't allow empty user
  const lang = query?.data?.extra?.lang;
  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => query, [query.data]);

  // todo: this cast can be resolved if we don't allow empty user
  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = (): CurrentUserContextType =>
  useContext(CurrentUserContext);
