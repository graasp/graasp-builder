import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { buildUploadFilesRoute } from '../api/routes';
import { API_HOST, FILE_UPLOAD_MAX_FILES } from '../config/constants';

const configureUppy = ({ itemId, onComplete, onProgress, onUpload }) => {
  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: FILE_UPLOAD_MAX_FILES },
    autoProceed: true,
  });

  uppy.use(XHRUpload, {
    endpoint: `${API_HOST}/${buildUploadFilesRoute(itemId)}`,
    withCredentials: true,
    formData: true,
    metaFields: [],
  });

  uppy.on('upload', onUpload);

  uppy.on('progress', onProgress);

  uppy.on('complete', onComplete);

  uppy.on('error', (error) => {
    console.error(error.stack);
  });

  return uppy;
};

export default configureUppy;
