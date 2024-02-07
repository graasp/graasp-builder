import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import Typography from '@mui/material/Typography';

import { routines } from '@graasp/query-client';
import { MAX_ZIP_FILE_SIZE } from '@graasp/sdk';

import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';

import { useBuilderTranslation } from '../../config/i18n';
import notifier from '../../config/notifier';
import { ZIP_DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { configureZipImportUppy, humanFileSize } from '../../utils/uppy';

const ImportZip = () => {
  const [uppy, setUppy] = useState(null);

  const { itemId } = useParams();

  const { t: translateBuilder } = useBuilderTranslation();

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
      <Typography variant="h6">
        {translateBuilder(BUILDER.IMPORT_ZIP_TITLE)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.IMPORT_ZIP_INFORMATION)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.IMPORT_ZIP_WARNING)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.IMPORT_ZIP_LIMITATIONS_TEXT, {
          maxSize: humanFileSize(MAX_ZIP_FILE_SIZE),
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
