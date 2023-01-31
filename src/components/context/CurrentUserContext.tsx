import PropTypes from 'prop-types';

import { createContext, useEffect, useMemo } from 'react';

import i18n from '../../config/i18n';
import { hooks } from '../../config/queryClient';

const CurrentUserContext = createContext(null);

type Props = {
  children: JSX.Element | JSX.Element[];
};

const { useCurrentMember } = hooks;
const CurrentUserContextProvider = ({ children }: Props): JSX.Element => {
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

CurrentUserContextProvider.propTypes = {
  children: PropTypes.node,
};

CurrentUserContextProvider.defaultProps = {
  children: null,
};

export { CurrentUserContext, CurrentUserContextProvider };
