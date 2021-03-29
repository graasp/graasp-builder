import { API_HOST } from '../config/constants';
import { DEFAULT_GET, checkRequest } from './utils';

// eslint-disable-next-line import/prefer-default-export
export const signOut = async () => {
  const req = await fetch(`${API_HOST}/logout`, DEFAULT_GET).then(checkRequest);
  return req.ok;
};
