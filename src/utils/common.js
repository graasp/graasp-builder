import Cookies from 'js-cookie';

// could use redux store to keep session
// todo: better check on session
// eslint-disable-next-line import/prefer-default-export
export const isSignedIn = () => {
  const value = Cookies.get('session');
  return Boolean(value);
};

export const getOwnFromItems = (items) => items.filter(({ own }) => own);

// limit text length
// But fix: There must be a better way of doing it
export const shortenString = (string, maxLength) => {
  if (!string?.length > maxLength) {
    return string;
  }
  return `${string.split(' ').slice(0, maxLength).join(' ')}...`;
};
