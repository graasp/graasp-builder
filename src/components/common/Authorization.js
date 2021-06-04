import React from 'react';
import { useLocation } from 'react-router';
import { buildSignInPath } from '../../api/routes';
import {
  AUTHENTICATION_HOST,
  REDIRECT_URL_LOCAL_STORAGE_KEY,
} from '../../config/constants';
import { useCurrentMember } from '../../hooks';
import Loader from './Loader';

const Authorization = () => (ChildComponent) => {
  const ComposedComponent = (props) => {
    const { pathname } = useLocation();

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
      // save current url for later redirection after sign in
      localStorage.setItem(REDIRECT_URL_LOCAL_STORAGE_KEY, pathname);
      redirectToSignIn();
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <ChildComponent {...props} />;
  };
  return ComposedComponent;
};

export default Authorization;
