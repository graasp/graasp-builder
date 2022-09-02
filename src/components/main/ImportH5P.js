import { routines } from '@graasp/query-client';
import { MAX_ZIP_FILE_SIZE } from '@graasp/sdk';
import prettyBytes from 'pretty-bytes';
import Typography from '@material-ui/core/Typography';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router';
import notifier from '../../config/notifier';
import { buildItemPath } from '../../config/paths';
import { H5P_DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { configureH5PImportUppy } from '../../utils/uppy';

const ImportH5P = () => {
  const [uppy, setUppy] = useState(null);
  const match = useMatch(buildItemPath());
  const itemId = match?.params?.itemId;
  const { t } = useTranslation();

  const onComplete = (result) => {
    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (!result?.failed.length) {
      notifier({ type: routines.importH5PRoutine.SUCCESS });
    }
  };
  const onError = (error) => {
    notifier({ type: routines.importH5PRoutine.FAILURE, payload: { error } });
  };

  const onUpload = () => {
    notifier({ type: routines.importH5PRoutine.REQUEST });
  };

  const applyUppy = () =>
    setUppy(
      configureH5PImportUppy({
        itemId,
        onComplete,
        onError,
        onUpload,
      }),
    );

  useEffect(() => {
    applyUppy();

    return () => {
      uppy?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyUppy();
    // update uppy configuration each time itemId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!uppy) {
    return null;
  }

  return (
    <>
      <Typography variant="h6">{t('Import H5P rich content')}</Typography>
      <Typography variant="body" paragraph>
        {t(
          'You can upload H5P rich content by uploading exported .h5p files (e.g. from H5P.com, external Moodle services, etc).',
        )}
      </Typography>
      <Typography variant="body" paragraph>
        {t(
          'Once your file is accepted, it will take several minutes for it to be available.',
        )}
      </Typography>
      <Typography variant="body" paragraph>
        {t(`You can upload up to one ZIP of SIZE at a time.`, {
          maxSize: prettyBytes(MAX_ZIP_FILE_SIZE),
        })}
      </Typography>
      <div id={H5P_DASHBOARD_UPLOADER_ID}>
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

export default ImportH5P;
