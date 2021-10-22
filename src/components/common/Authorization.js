import React, { useContext } from 'react';
import { useLocation } from 'react-router';
import { API_ROUTES } from '@graasp/query-client';
import {
  AUTHENTICATION_HOST,
  REDIRECT_URL_LOCAL_STORAGE_KEY,
  NODE_ENV,
} from '../../config/constants';
import Loader from './Loader';
import RedirectPage from './RedirectionContent';
import { redirect } from '../../utils/navigation';
import { CurrentUserContext } from '../context/CurrentUserContext';

const Authorization = () => (ChildComponent) => {
  const ComposedComponent = (props) => {
    const { pathname } = useLocation();

    const redirectToSignIn = () => {
      redirect(
        `${AUTHENTICATION_HOST}/${API_ROUTES.buildSignInPath(
          `${window.location.origin}${pathname}`,
        )}`,
      );
    };

    const { data: currentMember, isLoading } = useContext(CurrentUserContext);

    if (isLoading) {
      return <Loader />;
    }

    // check authorization: user shouldn't be empty
    if (currentMember?.size) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <ChildComponent {...props} />;
    }

    // save current url for later redirection after sign in
    localStorage.setItem(REDIRECT_URL_LOCAL_STORAGE_KEY, pathname);

    // do not redirect in test environment to fully load a page
    // eslint-disable-next-line no-unused-expressions
    NODE_ENV !== 'test' && redirectToSignIn();

    // redirect page if redirection is not working
    return (
      <RedirectPage
        link={`${AUTHENTICATION_HOST}/${API_ROUTES.buildSignInPath(
          `${window.location.origin}${pathname}`,
        )}`}
      />
    );
  };
  return ComposedComponent;
};

export default Authorization;
