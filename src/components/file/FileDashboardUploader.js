import React, { useContext } from 'react';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import ErrorAlert from '../common/ErrorAlert';
import { UppyContext } from './UppyContext';

const FileDashboardUploader = () => {
  const { uppy } = useContext(UppyContext);
  const { t } = useTranslation();

  if (!uppy) {
    return <ErrorAlert />;
  }

  return (
    <>
      <Typography variant="h6">{t('Upload a File')}</Typography>
      <div id={DASHBOARD_UPLOADER_ID}>
        <Dashboard
          uppy={uppy}
          height={200}
          width="100%"
          proudlyDisplayPoweredByUppy={false}
          note={t(
            `You can upload up to FILE_UPLOAD_MAX_FILES files at a time`,
            {
              maxFiles: FILE_UPLOAD_MAX_FILES,
            },
          )}
          locale={{
            strings: {
              // Text to show on the droppable area.
              // `%{browse}` is replaced with a link that opens the system file selection dialog.
              dropPaste: `${t('Drop here or')} %{browse}`,
              // Used as the label for the link that opens the system file selection dialog.
              browse: t('Browse'),
            },
          }}
        />
      </div>
    </>
  );
};

export default FileDashboardUploader;
