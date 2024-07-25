import { ReactNode, createContext, useContext, useEffect } from 'react';

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
  const lang = data?.extra?.lang;
  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return children;
};

export const useCurrentUserContext = (): CurrentUserContextType =>
  useContext(CurrentUserContext);
