import React, { useEffect, useState } from 'react';
import '@uppy/dashboard/dist/style.css';
import { routines } from '@graasp/query-client';
import prettyBytes from 'pretty-bytes';
import { Dashboard } from '@uppy/react';
import { MAX_ZIP_FILE_SIZE } from '@graasp/sdk';
import { useMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { configureZipImportUppy } from '../../utils/uppy';
import { ZIP_DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { buildItemPath } from '../../config/paths';
import notifier from '../../config/notifier';

const ImportZip = () => {
  const [uppy, setUppy] = useState(null);
  const match = useMatch(buildItemPath());
  const itemId = match?.params?.itemId;
  const { t } = useTranslation();

  const onComplete = (result) => {
    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (!result?.failed.length) {
      notifier({ type: routines.importZipRoutine.SUCCESS });
    }
  };
  const onError = (error) => {
    notifier({ type: routines.importZipRoutine.FAILURE, payload: { error } });
  };

  const onUpload = () => {
    notifier({ type: routines.importZipRoutine.REQUEST });
  };

  const applyUppy = () =>
    setUppy(
      configureZipImportUppy({
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
      <Typography variant="h6">{t('Import a Graasp Archive')}</Typography>
      <Typography variant="body" paragraph>
        {t(
          'You can download your resources from graasp.eu by right clicking and choosing "Download as ZIP".',
        )}
      </Typography>
      <Typography variant="body" paragraph>
        {t(
          'Once your file is accepted, it will take several minutes for all imported files to be available.',
        )}
      </Typography>
      <Typography variant="body" paragraph>
        {t(`You can upload up to one ZIP of SIZE at a time.`, {
          maxSize: prettyBytes(MAX_ZIP_FILE_SIZE),
        })}
      </Typography>
      <div id={ZIP_DASHBOARD_UPLOADER_ID}>
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

export default ImportZip;
