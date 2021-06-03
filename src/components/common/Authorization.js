import React from 'react';
import { useLocation } from 'react-router';
import { buildSignInPath } from '../../api/routes';
import { AUTHENTICATION_HOST } from '../../config/constants';
import { useCurrentMember } from '../../hooks';
import Loader from './Loader';

const Authorization = () => (ChildComponent) => {
  const ComposedComponent = (props) => {
    const { location: { pathname } = {} } = useLocation();

    const redirectToSignIn = () => {
      window.location.href = `${AUTHENTICATION_HOST}/${buildSignInPath(
        `${window.location.origin}${pathname}`,
      )}`;
    };

    const { data: currentMember, isLoading, isError } = useCurrentMember();

    if (isLoading) {
      return <Loader />;
    }

    // check authorization
    if (isError || !currentMember) {
      redirectToSignIn();
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <ChildComponent {...props} />;
  };
  return ComposedComponent;
};

export default Authorization;
