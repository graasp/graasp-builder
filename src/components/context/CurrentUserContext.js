import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { hooks } from '../../config/queryClient';
import i18n from '../../config/i18n';

const CurrentUserContext = React.createContext();

const { useCurrentMember } = hooks;
const CurrentUserContextProvider = ({ children }) => {
  const query = useCurrentMember();

  // update language depending on user setting
  const lang = query?.data?.get('extra')?.lang;
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
