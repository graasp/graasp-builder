import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { API_ROUTES } from '@graasp/query-client';
import { API_HOST, FILE_UPLOAD_MAX_FILES } from '../config/constants';

const configureUppy = ({
  itemId,
  onComplete,
  onProgress,
  onUpload,
  onFilesAdded,
  onFileAdded,
  onError,
  buildEndpoint,
  fieldName = 'files',
  restrictions = {
    maxNumberOfFiles: FILE_UPLOAD_MAX_FILES,
  },
}) => {
  const uppy = new Uppy({
    restrictions,
    autoProceed: true,
  });

  uppy.use(XHRUpload, {
    endpoint: buildEndpoint(itemId),
    withCredentials: true,
    formData: true,
    fieldName,
    metaFields: [],
  });

  // todo: pre process file and check beforehand the user remaining storage

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
  onProgress,
}) =>
  configureUppy({
    itemId,
    onComplete,
    onFilesAdded,
    onError,
    onUpload,
    onProgress,
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
  onProgress,
}) =>
  configureUppy({
    itemId,
    onFilesAdded,
    onUpload,
    onComplete,
    onError,
    onProgress,
    // autoProceed: false,
    fieldName: 'file',
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['image/*'],
    },
    buildEndpoint: (id) =>
      `${API_HOST}/${API_ROUTES.buildUploadItemThumbnailRoute(id)}`,
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
    fieldName: 'file',
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['image/*'],
    },
    buildEndpoint: (id) =>
      `${API_HOST}/${API_ROUTES.buildUploadAvatarRoute(id)}`,
  });

export const configureZipImportUppy = ({
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
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['application/zip'],
    },
    buildEndpoint: (id) => `${API_HOST}/${API_ROUTES.buildImportZipRoute(id)}`,
  });
