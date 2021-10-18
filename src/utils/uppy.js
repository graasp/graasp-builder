import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import XHRUpload from '@uppy/xhr-upload';
import { API_ROUTES, Api } from '@graasp/query-client';
import {
  API_HOST,
  FILE_UPLOAD_MAX_FILES,
  UPLOAD_METHOD,
} from '../config/constants';
import { UPLOAD_FILES_METHODS } from '../enums';
import { DEFAULT_PUT } from '../api/utils';

const { uploadItemToS3 } = Api;

const configureUppy = ({
  itemId,
  onComplete,
  onProgress,
  onUpload,
  onFilesAdded,
  onFileAdded,
  onError,
  buildEndpoint,
  s3Upload,
  fieldName = 'files',
  restrictions = {
    maxNumberOfFiles: FILE_UPLOAD_MAX_FILES,
  },
  method,
}) => {
  const uppy = new Uppy({
    restrictions,
    autoProceed: true,
  });

  // define upload method
  switch (method ?? UPLOAD_METHOD ?? UPLOAD_FILES_METHODS.DEFAULT) {
    case UPLOAD_FILES_METHODS.S3:
      uppy.use(AwsS3, {
        async getUploadParameters(file) {
          // Send a request to s3
          const data = await s3Upload(
            {
              itemId,
              filename: file.name,
              contentType: file.type,
            },
            { API_HOST },
          );

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
        endpoint: buildEndpoint(itemId),
        withCredentials: true,
        formData: true,
        fieldName,
        metaFields: [],
      });
      break;
  }

  uppy.on('file-added', (file) => {
    onFileAdded?.(file);
  });

  uppy.on('files-added', (files) => {
    onFilesAdded?.(files);
  });

  uppy.on('upload', (data) => {
    onUpload?.(data);
  });

  uppy.on('progress', (progress) => {
    onProgress?.(progress);
  });

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

export const configureFileUppy = ({
  itemId,
  onComplete,
  onFilesAdded,
  onError,
  onUpload,
}) =>
  configureUppy({
    itemId,
    onComplete,
    onFilesAdded,
    onError,
    onUpload,
    s3Upload: uploadItemToS3,
    buildEndpoint: (id) =>
      `${API_HOST}/${API_ROUTES.buildUploadFilesRoute(id)}`,
  });

// thumbnail settings do not use the regular s3 upload
// because the backend needs to send the sizes
export const configureThumbnailUppy = ({
  itemId,
  onFilesAdded,
  onUpload,
  onComplete,
  onError,
}) =>
  configureUppy({
    itemId,
    onFilesAdded,
    onUpload,
    onComplete,
    onError,
    // autoProceed: false,
    fieldName: 'file',
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['image/*'],
    },
    buildEndpoint: (id) =>
      `${API_HOST}/${API_ROUTES.buildUploadItemThumbnailRoute(id)}`,
    method: UPLOAD_FILES_METHODS.DEFAULT,
  });

export const configureAvatarUppy = ({
  itemId,
  onFilesAdded,
  onUpload,
  onComplete,
  onError,
}) =>
  configureUppy({
    itemId,
    onFilesAdded,
    onUpload,
    onComplete,
    onError,
    // autoProceed: false,
    fieldName: 'file',
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['image/*'],
    },
    buildEndpoint: (id) =>
      `${API_HOST}/${API_ROUTES.buildUploadAvatarRoute(id)}`,
    method: UPLOAD_FILES_METHODS.DEFAULT,
  });
