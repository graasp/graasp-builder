import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import XHRUpload from '@uppy/xhr-upload';
import { buildUploadFilesRoute } from '../api/routes';
import {
  API_HOST,
  FILE_UPLOAD_MAX_FILES,
  UPLOAD_FILES_METHODS,
} from '../config/constants';
import { uploadItemToS3 } from '../api/item';
import { DEFAULT_PUT } from '../api/utils';

const configureUppy = ({
  itemId,
  onComplete,
  onProgress,
  onUpload,
  onFilesAdded,
  onError,
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
          const data = await uploadItemToS3({
            itemId,
            filename: file.name,
            contentType: file.type,
          });

          // Return an object in the correct shape.
          return {
            method: DEFAULT_PUT.method,
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

  uppy.on('files-added', onFilesAdded);

  uppy.on('upload', onUpload);

  uppy.on('progress', onProgress);

  uppy.on('complete', (result) => {
    onComplete?.(result);
  });

  uppy.on('error', (error) => {
    onError?.(error);
  });

  uppy.on('upload-error', (error) => {
    onError?.(error);
  });

  return uppy;
};

export default configureUppy;
