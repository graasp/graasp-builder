import Cookies from 'js-cookie';

// could use redux store to keep session
// todo: better check on session
// eslint-disable-next-line import/prefer-default-export
export const isSignedIn = () => {
  const value = Cookies.get('session');
  return Boolean(value);
};
