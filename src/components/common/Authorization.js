import React from 'react';
import { useLocation } from 'react-router';
import { API_ROUTES } from '@graasp/query-client';
import {
  AUTHENTICATION_HOST,
  REDIRECT_URL_LOCAL_STORAGE_KEY,
} from '../../config/constants';
import { hooks } from '../../config/queryClient';
import Loader from './Loader';

const Authorization = () => (ChildComponent) => {
  const ComposedComponent = (props) => {
    const { pathname } = useLocation();

    const redirectToSignIn = () => {
      window.location.href = `${AUTHENTICATION_HOST}/${API_ROUTES.buildSignInPath(
        `${window.location.origin}${pathname}`,
      )}`;
    };

    const {
      data: currentMember,
      isLoading,
      isError,
    } = hooks.useCurrentMember();

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
