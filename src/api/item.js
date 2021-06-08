import { API_ROUTES } from '@graasp/query-client';
import { API_HOST } from '../config/constants';
import { DEFAULT_POST, failOnError } from './utils';

const { buildS3UploadFileRoute } = API_ROUTES;

// eslint-disable-next-line import/prefer-default-export
export const uploadItemToS3 = async ({ itemId, filename, contentType }) => {
  const response = await fetch(
    `${API_HOST}/${buildS3UploadFileRoute(itemId)}`,
    {
      // Send and receive JSON.
      ...DEFAULT_POST,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        contentType,
      }),
    },
  ).then(failOnError);

  return response.json();
};
