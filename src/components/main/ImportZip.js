import React, { useEffect, useState } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { routines } from '@graasp/query-client';
import { Dashboard } from '@uppy/react';
import { useRouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { FILE_UPLOAD_MAX_FILES } from '../../config/constants';
import { configureZipImportUppy } from '../../utils/uppy';
import { ZIP_DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { buildItemPath } from '../../config/paths';
import notifier from '../../middlewares/notifier';

const ImportZip = () => {
  const [uppy, setUppy] = useState(null);
  const match = useRouteMatch(buildItemPath());
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

  const onFileAdded = () => {
    notifier({ type: routines.importZipRoutine.REQUEST });
  };

  const applyUppy = () =>
    setUppy(
      configureZipImportUppy({
        itemId,
        onComplete,
        onError,
        onFileAdded,
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
      <Typography variant="caption">
        {t(
          'You can download your resources from graasp.eu by right clicking and choosing "Download as ZIP".',
        )}
      </Typography>
      <div id={ZIP_DASHBOARD_UPLOADER_ID}>
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

export default ImportZip;
