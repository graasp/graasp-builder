import '@uppy/dashboard/dist/style.css';

import { useContext } from 'react';

import { Typography } from '@mui/material';

import { MAX_FILE_SIZE } from '@graasp/sdk';

import DashboardLocale from '@uppy/dashboard/types/generatedLocale';
import { Dashboard } from '@uppy/react';
import { StatusBarLocale } from '@uppy/status-bar';

import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { humanFileSize } from '../../utils/uppy';
import ErrorAlert from '../common/ErrorAlert';
import { UppyContext } from './UppyContext';

type Props = {
  onComplete: () => void;
};
const FileDashboardUploader = ({ onComplete }: Props): JSX.Element => {
  const { uppy } = useContext(UppyContext);
  const { t: translateBuilder, i18n } = useBuilderTranslation();
  const uppyLocales = i18n.options.resources?.[i18n.language]
    ?.uppy as (DashboardLocale & StatusBarLocale)['strings'];

  if (!uppy) {
    return <ErrorAlert />;
  }

  // when uppy is done, notify parent
  // this should close the dialog
  uppy.on('complete', () => {
    uppy.cancelAll();
    onComplete();
  });

  return (
    <>
      <Typography variant="h6">
        {translateBuilder(BUILDER.UPLOAD_FILE_TITLE)}
      </Typography>
      <Typography variant="body1" paragraph>
        {translateBuilder(BUILDER.UPLOAD_FILE_INFORMATIONS)}
      </Typography>
      <Typography variant="body1" paragraph>
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
          locale={
            uppyLocales
              ? {
                  strings: uppyLocales,
                }
              : undefined
          }
        />
      </div>
    </>
  );
};

export default FileDashboardUploader;
