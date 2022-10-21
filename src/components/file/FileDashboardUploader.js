import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';

import Typography from '@mui/material/Typography';

import { useContext } from 'react';

import { MAX_FILE_SIZE } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { humanFileSize } from '../../utils/uppy';
import ErrorAlert from '../common/ErrorAlert';
import { UppyContext } from './UppyContext';

const FileDashboardUploader = () => {
  const { uppy } = useContext(UppyContext);
  const { t: translateBuilder, i18n } = useBuilderTranslation();

  if (!uppy) {
    return <ErrorAlert />;
  }

  return (
    <>
      <Typography variant="h6">
        {translateBuilder(BUILDER.UPLOAD_FILE_TITLE)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.UPLOAD_FILE_INFORMATIONS)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.UPLOAD_FILE_LIMITATIONS_TEXT, {
          maxFiles: FILE_UPLOAD_MAX_FILES,
          maxSize: humanFileSize(MAX_FILE_SIZE),
        })}
      </Typography>
      <div id={DASHBOARD_UPLOADER_ID}>
        <Dashboard
          uppy={uppy}
          height={200}
          width="100%"
          proudlyDisplayPoweredByUppy={false}
          locale={{
            strings: i18n.options.resources[i18n.language].uppy,
          }}
        />
      </div>
    </>
  );
};

export default FileDashboardUploader;
