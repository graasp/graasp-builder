import { API_ROUTES } from '@graasp/query-client';
import { API_HOST } from '../config/constants';
import { DEFAULT_GET, DEFAULT_POST, failOnError } from './utils';

const {
  buildDownloadFilesRoute,
  buildGetS3MetadataRoute,
  buildS3FileUrl,
  buildS3UploadFileRoute,
} = API_ROUTES;

export const getFileContent = async ({ id }) => {
  const response = await fetch(
    `${API_HOST}/${buildDownloadFilesRoute(id)}`,
    DEFAULT_GET,
  );
  return response;
};

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

export const getS3FileUrl = async ({ id }) => {
  const response = await fetch(
    `${API_HOST}/${buildGetS3MetadataRoute(id)}`,
    DEFAULT_GET,
  ).then(failOnError);

  const { key } = await response.json();
  return buildS3FileUrl(key);
};
