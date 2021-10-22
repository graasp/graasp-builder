import React from 'react';
import PropTypes from 'prop-types';
import { hooks } from '../../config/queryClient';

const CurrentUserContext = React.createContext();

const { useCurrentMember } = hooks;
const CurrentUserContextProvider = ({ children }) => {
  const hook = useCurrentMember();

  return (
    <CurrentUserContext.Provider value={hook}>
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
