import React, { useContext } from 'react';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import { MAX_FILE_SIZE } from '@graasp/sdk';
import Typography from '@material-ui/core/Typography';
import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import ErrorAlert from '../common/ErrorAlert';
import { UppyContext } from './UppyContext';
import { humanFileSize } from '../../utils/uppy';

const FileDashboardUploader = () => {
  const { uppy } = useContext(UppyContext);
  const { t } = useTranslation();

  if (!uppy) {
    return <ErrorAlert />;
  }

  return (
    <>
      <Typography variant="h6">{t('Upload a File')}</Typography>
      <Typography variant="body" paragraph>
        {t(
          'If you drag-and-drop zip or H5P archives, or if you import them as a new "FILE", they will be stored as such. To expand and use them, use the special "IMPORT ZIP" or "IMPORT H5P" option.',
        )}
      </Typography>
      <Typography variant="body" paragraph>
        {t(
          `You can upload up to FILE_UPLOAD_MAX_FILES files of MAX_FILE_SIZE at a time.`,
          {
            maxFiles: FILE_UPLOAD_MAX_FILES,
            maxSize: humanFileSize(MAX_FILE_SIZE),
          },
        )}
      </Typography>
      <div id={DASHBOARD_UPLOADER_ID}>
        <Dashboard
          uppy={uppy}
          height={200}
          width="100%"
          proudlyDisplayPoweredByUppy={false}
        />
      </div>
    </>
  );
};

export default FileDashboardUploader;
