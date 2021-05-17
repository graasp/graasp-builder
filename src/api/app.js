import { API_HOST } from '../config/constants';
import { buildItemAppApiAccessTokenRoute } from './routes';
import { DEFAULT_POST, failOnError } from './utils';

// eslint-disable-next-line import/prefer-default-export
export const requestApiAccessToken = async ({ id, origin, app }) => {
  const res = await fetch(
    `${API_HOST}/${buildItemAppApiAccessTokenRoute(id)}`,
    {
      ...DEFAULT_POST,
      body: JSON.stringify({ origin, app }),
    },
  ).then(failOnError);

  return res.json();
};
