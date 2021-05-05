import { API_HOST } from '../config/constants';
import { failOnError, DEFAULT_POST, DEFAULT_GET, DEFAULT_PUT } from './utils';
import {
  buildGetItemLoginRoute,
  buildPostItemLoginSignInRoute,
  buildPutItemLoginSchema,
} from './routes';

// eslint-disable-next-line import/prefer-default-export
export const itemLoginSignIn = async ({
  itemId,
  username,
  memberId,
  password,
}) => {
  const res = await fetch(
    `${API_HOST}/${buildPostItemLoginSignInRoute(itemId)}`,
    {
      ...DEFAULT_POST,
      body: JSON.stringify({
        username: username?.trim(),
        memberId: memberId?.trim(),
        password,
      }),
    },
  ).then(failOnError);

  return res.ok;
};

export const getItemLogin = async (id) => {
  const res = await fetch(
    `${API_HOST}/${buildGetItemLoginRoute(id)}`,
    DEFAULT_GET,
  ).then(failOnError);

  return res.json();
};

export const putItemLoginSchema = async ({ itemId, loginSchema }) => {
  const res = await fetch(`${API_HOST}/${buildPutItemLoginSchema(itemId)}`, {
    ...DEFAULT_PUT,
    body: JSON.stringify({ loginSchema }),
  }).then(failOnError);

  return res.json();
};
