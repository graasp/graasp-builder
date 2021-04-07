import { API_HOST } from '../config/constants';
import { SIGN_OUT_ROUTE } from './routes';
import { DEFAULT_GET, checkRequest } from './utils';

// eslint-disable-next-line import/prefer-default-export
export const signOut = async () => {
  const req = await fetch(`${API_HOST}/${SIGN_OUT_ROUTE}`, DEFAULT_GET).then(
    checkRequest,
  );
  return req.ok;
};
