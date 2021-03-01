import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import XHRUpload from '@uppy/xhr-upload';
import { buildS3UploadFileRoute, buildUploadFilesRoute } from '../api/routes';
import {
  API_HOST,
  FILE_UPLOAD_MAX_FILES,
  UPLOAD_FILES_METHODS,
} from '../config/constants';
import { DEFAULT_POST } from '../api/utils';

const configureUppy = ({
  itemId,
  onComplete,
  onProgress,
  onUpload,
  method = UPLOAD_FILES_METHODS.DEFAULT,
}) => {
  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: FILE_UPLOAD_MAX_FILES },
    autoProceed: true,
  });

  // define upload method
  switch (method) {
    case UPLOAD_FILES_METHODS.S3:
      uppy.use(AwsS3, {
        async getUploadParameters(file) {
          // Send a request to s3
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
                filename: file.name,
                contentType: file.type,
              }),
            },
          );

          const data = await response.json();

          // Return an object in the correct shape.
          return {
            method: 'put',
            url: data.uploadUrl,
            fields: [],
            // Provide content type header required by S3
            headers: {
              'Content-Type': file.type,
              'Content-disposition': `attachment; filename=${file.name}`,
            },
          };
        },
      });
      break;

    case UPLOAD_FILES_METHODS.DEFAULT:
    default:
      uppy.use(XHRUpload, {
        endpoint: `${API_HOST}/${buildUploadFilesRoute(itemId)}`,
        withCredentials: true,
        formData: true,
        metaFields: [],
      });
      break;
  }

  uppy.on('upload', onUpload);

  uppy.on('progress', onProgress);

  uppy.on('complete', onComplete);

  uppy.on('error', (error) => {
    console.error(error.stack);
  });

  return uppy;
};

export default configureUppy;
